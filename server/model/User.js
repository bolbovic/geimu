const Cliented = require('./Cliented')

class User extends Cliented {
  constructor (name, socket) {
    super()
    this.hand = ['a', 'b', 'c', 'your mom', 'my dick', 'my dick in a box', 'farts']
    this.name = name
    this.score = 0
    this.socket = socket
  }

  update (data) {
    this.socket.emit('new-data', data)
  }

  toClient () {
    return {
      name: this.name,
      score: this.score
    }
  }
}

module.exports = User
