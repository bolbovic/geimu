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
    this.questions = shuffle(deck.blackCards)
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
        u.changePage('waiting-answers', this.getWaitingUpdate(u))
      } else {
        u.changePage('pick-answer', {
          hand: u.hand,
          picker: this.picker.toClient(),
          question: q
        })
      }
    })
  }

  chooseAnswer (userName, answers) {
    const u = this.getUser(userName)
    u.picked = answers
    answers.forEach(a => this.discard.push(u.hand.splice(u.hand.indexOf(a), 1, this.whiteCards.shift())))
    if (this.everyonePicked) {
      this.users.forEach(u => u.changePage('answers', this.getWaitingUpdate(u)))
    } else {
      const us = this.getWaitingUsers()
      us.forEach(u => {
        if (u.name === userName) {
          u.changePage('waiting-answers', this.getWaitingUpdate(u))
        } else {
          u.update(this.getWaitingUpdate(u))
        }
      })
    }
  }

  pickAnswer (u) {
    this.winner = this.getUser(u)
    this.winner.won(this.question)
    this.users.forEach(u => {
      u.changePage('results', this.getResultsUdate(u))
    })
  }

  setReady (u) {
    this.getUser(u).ready = true
    if (this.everyoneReady) {
      this.nextQuestion()
    } else {
      this.users.forEach(u => u.update(this.getResultsUdate(u)))
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
    this.winner = {}
    this.users.forEach(u => {
      u.resetRound()
      console.log('next-question', u.name, this.picker.name)
      if (this.picker.name === u.name) {
        u.changePage('pick-question', {
          questions: this.questions.splice(0, 5)
        })
      } else {
        u.changePage('scoreboard', this.getWaitingUpdate(u))
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

  getWaitingUpdate (u) {
    return {
      hand: u.hand,
      question: this.question,
      picker: this.picker.toClient(),
      users: this.users.map(uu => uu.toClient())
    }
  }

  getResultsUdate (u) {
    return Object.assign(this.getWaitingUpdate(u), { winner: this.winner.toClient() })
  }

  toClient () {
    return {
      master: this.master.toClient(),
      name: this.name,
      users: this.users.map(u => u.toClient())
    }
  }
}

module.exports = Room
