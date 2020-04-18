const Cliented = require('./Cliented')

class User extends Cliented {
  constructor (name, socket) {
    super()
    this.name = name
    this.socket = socket
  }

  update (data) {
    this.socket.emit('new-data', data)
  }

  toClient () {
    return {
      name: this.name
    }
  }
}

module.exports = User
