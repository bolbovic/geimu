import Cliented from './Cliented'
import User from './User'

function shuffle(array: Array<any>) {
  let currentIndex:number = array.length, temporaryValue: any, randomIndex:number

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array;
}


interface Deck {
  blackCards: string[],
  whiteCards: string[]
}

class Room extends Cliented {
  master: User
  name: string
  question: string
  users: User[]
  idxUser: number
  blackCards: string[]
  whiteCards: string[]
  discard: string[]
  picker: User | null
  winner: User | null
  shuffledUsers: User[]
  waitingPhase: string | null
  gameStarted: boolean
  whereToSendNewUser: string
  choices: string[]


  constructor (name: string, master: User, deck: Deck) {
    super()
    this.master = master
    this.name = name
    this.question = ''
    this.users = [master]
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
    this.users[0].hand = this.whiteCards.splice(0, 7)
  }

  userJoins (user:User) {
    this.users.push(user)
    user.hand = this.whiteCards.splice(0, 7)
    this.users.forEach(u => {
      if (this.gameStarted) {
        if (user.name !== u.name) {
          u.update(this.getUpdate())
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

  chooseQuestion (q:string) {
    this.question = q
    this.waitingPhase = 'picking'
    this.whereToSendNewUser = 'pick-answer'
    this.users.forEach(u => {
      console.log('choose-question', u.name, this.picker.name)
      if (this.picker.name === u.name) {
        u.changePage('waiting-answers', this.getUpdate())
      } else {
        u.changePage('pick-answer', this.getUpdate())
      }
    })
  }

  chooseAnswer (userName:string, answers: string[]) {
    const u = this.getUser(userName)
    u.picked = answers
    u.changePage('waiting-answers', this.getUpdate())
    answers.forEach(a => this.discard.push(u.hand.splice(u.hand.indexOf(a), 1, this.whiteCards.shift())))
    this.letsContinue()
  }

  pickAnswer (u:string) {
    this.winner = this.getUser(u)
    this.winner.won(this.question)
    this.waitingPhase = 'ready'
    this.whereToSendNewUser = 'results'
    this.users.forEach(u => {
      if (u.name !== this.winner.name && u.name !== this.picker.name) {
        u.canChange = true
      }
      u.changePage('results', this.getUpdate())
    })
  }

  setReady (u:string) {
    this.getUser(u).ready = true
    this.letsContinue()
  }

  switchCard (u:string, c:string) {
    const user = this.getUser(u)
    if (user.canChange) {
      this.whiteCards.push(c)
      user.switchCard(c, this.whiteCards.shift())
      user.update(this.getUpdate())
    }
  }

  letsContinue () {
    console.log('lets continue ', this.waitingPhase)
    if (this.waitingPhase === 'picking') {
      if (this.everyonePicked) {
        this.waitingPhase = null
        this.shuffledUsers = shuffle(this.users)
        this.whereToSendNewUser = 'answers'
        this.users.forEach(u => u.changePage('answers', this.getUpdate()))
      } else {
        const us = this.getWaitingUsers()
        us.forEach(u => {
          u.update(this.getUpdate())
        })
      }
    } else if (this.waitingPhase === 'ready') {
      if (this.everyoneReady) {
        this.waitingPhase = null
        this.nextQuestion()
      } else {
        this.users.forEach(u => u.update(this.getUpdate()))
      }
    }
  }

  startGame () {
    this.gameStarted = true
    this.nextQuestion()
  }

  nextQuestion () {
    this.pickNextUser()
    this.picker = this.users[this.idxUser]
    this.winner = null
    this.whereToSendNewUser = 'scoreboard'
    this.choices = this.blackCards.splice(0, 2)
    this.users.forEach(u => {
      u.resetRound()
      if (this.picker.name === u.name) {
        u.changePage('pick-question', this.getUpdate())
      } else {
        u.changePage('scoreboard', this.getUpdate())
      }
    })
  }

  pickNextUser () {
    this.idxUser = (this.idxUser + 1) % this.users.length
  }

  getUser (name:string) {
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

  getUpdate () {
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
      blackCardsLeft: this.blackCards.length,
      whiteCardsLeft: this.whiteCards.length,
      master: this.master.toClient(),
      name: this.name,
      users: this.users.map(u => u.toClient())
    }
  }

  tryReconnect (u:string, socket:any) {
    const user = this.getUser(u)
    if (user && user.disconnected === true) {
      user.reconnect(socket)
      this.users.forEach(u => {
        if (u.name !== user.name) {
          u.update(this.getUpdate())
        } else {
          user.reconnectPage(this.getUpdate())
        }
      })
      return true
    } else {
      socket.emit('error-reconnect', 'Impossible to reconnect')
      return false
    }
  }

  userDisconnected (ud) {
    this.getUser(ud).disconnected = true
    this.users.forEach(u => {
      if (u.name !== ud) {
        u.update(this.getUpdate())
      }
    })
  }

  userLeft (userName:string) {
    const u = this.getUser(userName)
    this.users.splice(this.users.indexOf(u), 1)
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
      this.users.forEach(u => u.update(this.getUpdate()))
    }
  }

  quit (userName:string) {
    this.userLeft(userName)
    this.users.forEach(u => u.sendInfo(`${userName} has left the game`))
  }

  disband (userName:string) {
    this.users.forEach(u => {
      u.socket.emit('error-reconnect', `Game disbanded by ${userName}`)
    })
  }

  kick (userName:string) {
    this.userLeft(userName)
    this.users.forEach(u => u.sendInfo(`${userName} has been kicked`))
  }
}

export default Room
