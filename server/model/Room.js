const Cliented = require('./Cliented')

class Room extends Cliented {
  constructor (name, master) {
    super()
    this.master = master
    this.name = name
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
    this.users.forEach(u => {
      console.log('choose-question', u.name, this.picker.name)
      if (this.picker.name === u.name) {
        u.socket.emit('change-page', {
          page: 'waiting-answers',
          data: {
            picked: {},
            picker: this.picker.toClient(),
            users: this.users.map(uu => uu.toClient())
          }
        })
      } else {
        u.socket.emit('change-page', {
          page: 'pick-answer',
          data: { hand: u.hand, picker: this.picker.toClient(), question: q }
        })
      }
    })
  }

  startGame () {
    this.nextQuestion()
  }

  nextQuestion () {
    this.pickNextUser()
    this.picker = this.users[this.idxUser]
    this.users.forEach(u => {
      console.log('next-question', u.name, this.picker.name)
      if (this.picker.name === u.name) {
        u.socket.emit('change-page', {
          page: 'pick-question',
          data: { questions: ['What is your name?', 'What is your age?'] }
        })
      } else {
        u.socket.emit('change-page', {
          page: 'scoreboard',
          data: {
            hand: u.hand,
            users: this.users.map(u => u.toClient())
          }
        })
      }
    })
  }

  pickNextUser () {
    this.idxUser++
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
