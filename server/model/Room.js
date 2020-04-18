const Cliented = require('./Cliented')

class Room extends Cliented {
  constructor (name, master) {
    super()
    this.master = master
    this.name = name
    this.users = [master]
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

  toClient () {
    return {
      master: this.master.toClient(),
      name: this.name,
      users: this.users.map(u => u.toClient())
    }
  }
}

module.exports = Room
