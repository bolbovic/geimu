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
  }

  addUser (user) {
    this.users.push(user)
    this.users.forEach(u => {
      if (user.name !== u.name) {
        console.log('emiting to...', u.name)
        u.update(this.toClient())
      }
    })
  }

  chooseQuestion (q) {
    this.question = q
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
    answers.forEach(a => this.discard.push(u.hand.splice(u.hand.indexOf(a), 1, this.whiteCards.shift())))
    if (this.everyonePicked) {
      this.users.forEach(u => u.changePage('answers', this.getUpdate(u)))
    } else {
      const us = this.getWaitingUsers()
      us.forEach(u => {
        if (u.name === userName) {
          u.changePage('waiting-answers', this.getUpdate(u))
        } else {
          u.update(this.getUpdate(u))
        }
      })
    }
  }

  pickAnswer (u) {
    this.winner = this.getUser(u)
    this.winner.won(this.question)
    this.users.forEach(u => {
      u.changePage('results', this.getUpdate(u))
    })
  }

  setReady (u) {
    this.getUser(u).ready = true
    if (this.everyoneReady) {
      this.nextQuestion()
    } else {
      this.users.forEach(u => u.update(this.getUpdate(u)))
    }
  }

  startGame () {
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
    this.choices = this.blackCards.splice(0, 3)
    this.users.forEach(u => {
      u.resetRound()
      console.log('next-question', u.name, this.picker.name)
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
      picker: this.picker.toClient(),
      question: this.question,
      users: this.users.map(uu => uu.toClient()),
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
    if (user.disconnected === true) {
      this.users.forEach(u => {
        if (u.name !== user.name) {
          u.update(this.getUpdate(u))
        } else {
          u.reconnect(socket, this.getUpdate(u))
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
}

module.exports = Room
