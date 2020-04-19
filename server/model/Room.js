const Cliented = require('./Cliented')

class Room extends Cliented {
  constructor (name, master) {
    super()
    this.master = master
    this.name = name
    this.question = ''
    this.users = []
    this.users.push(master)
    this.idxUser = -1
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
        u.changePage('waiting-answers', this.getWaitingUpdate())
      } else {
        u.changePage('pick-answer', {
          hand: u.hand,
          picker: this.picker.toClient(),
          question: q
        })
      }
    })
  }

  chooseAnswer (userName, answer) {
    this.getUser(userName).picked = answer
    if (this.everyonePicked) {
      this.users.forEach(u => u.changePage('answers', this.getWaitingUpdate()))
    } else {
      const us = this.getWaitingUsers()
      us.forEach(u => {
        if (u.name === userName) {
          u.changePage('waiting-answers', this.getWaitingUpdate())
        } else {
          u.update(this.getWaitingUpdate())
        }
      })
    }
  }

  pickAnswer (u) {
    this.winner = this.getUser(u)
    this.winner.won(this.question)
    this.users.forEach(u => {
      u.changePage('results', this.getResultsUdate())
    })
  }

  setReady (u) {
    this.getUser(u).ready = true
    if (this.everyoneReady) {
      this.nextQuestion()
    } else {
      this.users.forEach(u => u.update(this.getResultsUdate()))
    }
  }

  startGame () {
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
        u.changePage('pick-question', { questions: ['What is your name?', 'What is your age?'] })
      } else {
        u.changePage('scoreboard', this.getWaitingUpdate())
      }
    })
  }

  pickNextUser () {
    this.idxUser++
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

  getWaitingUpdate () {
    return {
      question: this.question,
      picker: this.picker.toClient(),
      users: this.users.map(uu => uu.toClient())
    }
  }

  getResultsUdate () {
    return Object.assign(this.getWaitingUpdate(), { winner: this.winner.toClient() })
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
