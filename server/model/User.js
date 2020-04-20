const Cliented = require('./Cliented')

class User extends Cliented {
  constructor (name, socket) {
    super()
    this.hand = []
    this.name = name
    this.score = 0
    this.pairs = []
    this.socket = socket
    this.picked = null
    this.ready = false
    this.disconnected = false
  }

  changePage (page, data) {
    this.lastPage = page
    !this.disconnected && this.socket.emit('change-page', { page, data: this.myData(data) })
  }

  update (data) {
    !this.disconnected && this.socket.emit('new-data', this.myData(data))
  }

  reconnect (socket, data) {
    this.socket = socket
    this.disconnected = false
  }

  reconnectPage (data) {
    this.changePage(this.lastPage, data)
  }

  won (q) {
    this.score++
    this.pairs.push({ q, a: this.picked })
  }

  resetRound () {
    this.picked = null
    this.ready = false
  }

  myData (data) {
    return Object.assign(data, {
      hand: this.hand,
      self: Object.assign(this.toClient(), { hand: this.hand })
    })
  }

  toClient () {
    return {
      disconnected: this.disconnected,
      name: this.name,
      pairs: this.pairs,
      picked: this.picked,
      ready: this.ready,
      score: this.score
    }
  }
}

module.exports = User
