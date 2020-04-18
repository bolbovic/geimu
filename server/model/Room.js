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

  startGame () {
    this.nextQuestion()
  }

  nextQuestion () {
    this.pickNextUser()
    const picker = this.users[this.idxUser]
    this.users.forEach(u => {
      console.log('next-question', u.name, picker.name)
      if (picker.name === u.name) {
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
