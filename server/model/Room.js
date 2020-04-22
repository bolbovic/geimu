const Cliented = require('./Cliented')
const shuffle = require('lodash').shuffle

class Room extends Cliented {
  constructor (name, master, deck) {
    super()
    this.master = master
    this.name = name
    this.question = ''
    this.users = []
    this.users.push(master)
    this.idxUser = -1
    this.blackCards = shuffle(deck.blackCards)
    this.whiteCards = shuffle(deck.whiteCards)
    this.discard = []
    this.picker = null
    this.winner = null
    this.shuffledUsers = []
    this.waitingPhase = null
    this.gameStarted = false
    this.whereToSendNewUser = 'lobby'
  }

  userJoins (user) {
    this.users.push(user)
    user.hand = this.whiteCards.splice(0, 7)
    this.users.forEach(u => {
      if (this.gameStarted) {
        if (user.name !== u.name) {
          u.update(this.getUpdate(u))
          u.sendInfo(`${user.name} joined!`)
        } else {
          u.changePage(this.whereToSendNewUser, this.getUpdate())
          if (this.waitingPhase) {
            this.letsContinue()
          }
        }
      } else {
        if (user.name !== u.name) {
          u.update(this.toClient())
        } else {
          u.changePage('lobby', this.toClient())
        }
      }
    })
  }

  chooseQuestion (q) {
    this.question = q
    this.picker.picked = q
    this.waitingPhase = 'picking'
    this.whereToSendNewUser = 'pick-answer'
    this.users.forEach(u => {
      console.log('choose-question', u.name, this.picker.name)
      if (this.picker.name === u.name) {
        u.changePage('waiting-answers', this.getUpdate(u))
      } else {
        u.changePage('pick-answer', this.getUpdate(u))
      }
    })
  }

  chooseAnswer (userName, answers) {
    const u = this.getUser(userName)
    u.picked = answers
    u.changePage('waiting-answers', this.getUpdate(u))
    answers.forEach(a => this.discard.push(u.hand.splice(u.hand.indexOf(a), 1, this.whiteCards.shift())))
    this.letsContinue()
  }

  pickAnswer (u) {
    this.winner = this.getUser(u)
    this.winner.won(this.question)
    this.waitingPhase = 'ready'
    this.whereToSendNewUser = 'results'
    this.users.forEach(u => {
      u.changePage('results', this.getUpdate(u))
    })
  }

  setReady (u) {
    this.getUser(u).ready = true
    this.letsContinue()
  }

  letsContinue () {
    console.log('lets continue ', this.waitingPhase)
    if (this.waitingPhase === 'picking') {
      if (this.everyonePicked) {
        this.waitingPhase = null
        this.shuffledUsers = shuffle(this.users)
        this.whereToSendNewUser = 'answers'
        this.users.forEach(u => u.changePage('answers', this.getUpdate(u)))
      } else {
        const us = this.getWaitingUsers()
        us.forEach(u => {
          u.update(this.getUpdate(u))
        })
      }
    } else if (this.waitingPhase === 'ready') {
      if (this.everyoneReady) {
        this.waitingPhase = null
        this.nextQuestion()
      } else {
        this.users.forEach(u => u.update(this.getUpdate(u)))
      }
    }
  }

  startGame () {
    this.gameStarted = true
    this.users.forEach(u => {
      u.hand = this.whiteCards.splice(0, 7)
    })
    this.nextQuestion()
  }

  nextQuestion () {
    this.pickNextUser()
    this.picker = this.users[this.idxUser]
    this.picked = {}
    this.winner = null
    this.whereToSendNewUser = 'scoreboard'
    this.choices = this.blackCards.splice(0, 3)
    this.users.forEach(u => {
      u.resetRound()
      if (this.picker.name === u.name) {
        u.changePage('pick-question', this.getUpdate(u))
      } else {
        u.changePage('scoreboard', this.getUpdate(u))
      }
    })
  }

  pickNextUser () {
    this.idxUser = (this.idxUser + 1) % this.users.length
  }

  getUser (name) {
    let uu = null
    this.users.forEach(u => {
      if (name === u.name) uu = u
    })
    return uu
  }

  get everyonePicked () {
    let bool = true
    this.users.forEach(u => {
      if (u.picked === null && u.name !== this.picker.name) bool = false
    })
    return bool
  }

  get everyoneReady () {
    let bool = true
    this.users.forEach(u => {
      if (!u.ready) bool = false
    })
    return bool
  }

  getWaitingUsers () {
    return [this.picker].concat(this.users.filter(u => u.picked !== null))
  }

  getUpdate (u) {
    return {
      choices: this.choices,
      master: this.master.toClient(),
      name: this.name,
      picker: this.picker ? this.picker.toClient() : null,
      question: this.question,
      shuffledUsers: this.shuffledUsers.map(uu => uu.toClient()),
      users: this.users.map(uu => uu.toClient()),
      blackCardsLeft: this.blackCards.length,
      whiteCardsLeft: this.whiteCards.length,
      winner: this.winner ? this.winner.toClient() : null
    }
  }

  toClient () {
    return {
      master: this.master.toClient(),
      name: this.name,
      users: this.users.map(u => u.toClient())
    }
  }

  tryReconnect (u, socket) {
    const user = this.getUser(u)
    if (user && user.disconnected === true) {
      user.reconnect(socket)
      this.users.forEach(u => {
        if (u.name !== user.name) {
          u.update(this.getUpdate(u))
        } else {
          user.reconnectPage(this.getUpdate(u))
        }
      })
      return true
    } else {
      socket.emit('error-reconnect', 'Impossible to reconnect')
      return false
    }
  }

  userDisconnected (u) {
    this.getUser(u).disconnected = true
    this.users.forEach(u => {
      if (u.name !== u) {
        u.update(this.getUpdate(u))
      }
    })
  }

  quit (userName) {
    const u = this.getUser(userName)
    this.users.splice(this.users.indexOf(u), 1)
    this.users.forEach(u => u.sendInfo(`${userName} has left the game`))
    if (this.master.name === u.name) {
      this.master = this.users[0]
    }
    if (this.users.length < 3) {
      this.gameStarted = false
      this.users.forEach(uu => uu.changePage('lobby', this.toClient()))
    } else if (this.picker.name === userName) {
      this.idxUser -= 1
      this.nextQuestion()
    } else if (this.waitingPhase) {
      this.letsContinue()
    } else {
      this.users.forEach(u => u.update(this.getUpdate(u)))
    }
  }

  disband (userName) {
    this.users.forEach(u => {
      u.socket.emit('error-reconnect', `Game disbanded by ${userName}`)
    })
  }
}

module.exports = Room
