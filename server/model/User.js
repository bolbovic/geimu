const Cliented = require('./Cliented')

class User extends Cliented {
  constructor (name, socket) {
    super()
    this.hand = ['a', 'b', 'c', 'your mom', 'my dick', 'my dick in a box', 'farts']
    this.name = name
    this.score = 0
    this.pairs = []
    this.socket = socket
    this.picked = null
    this.ready = false
  }

  changePage (page, data) {
    this.socket.emit('change-page', { page, data })
  }

  update (data) {
    this.socket.emit('new-data', data)
  }

  won (q) {
    this.score++
    this.pairs.push({ q, a: this.picked })
  }

  resetRound () {
    this.picked = null
    this.ready = false
    // get new card
  }

  toClient () {
    return {
      name: this.name,
      pairs: this.pairs,
      picked: this.picked,
      ready: this.ready,
      score: this.score
    }
  }
}

module.exports = User
