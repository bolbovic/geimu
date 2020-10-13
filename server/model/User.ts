import Cliented from './Cliented'

interface Pair {
  q: string,
  a: string[]
}

class User extends Cliented {
  hand: string[]
  name: string
  score: number
  pairs: Pair[]
  socket: any
  picked: string[]
  ready: boolean
  disconnected: boolean
  lastPage: string
  canChange: boolean

  constructor (name:string, socket:any) {
    super()
    this.hand = []
    this.name = name
    this.score = 0
    this.pairs = []
    this.socket = socket
    this.picked = null
    this.ready = false
    this.disconnected = false
    this.lastPage = 'lobby'
    this.canChange = false
  }

  changePage (page, data) {
    this.lastPage = page
    !this.disconnected && this.socket.emit('change-page', { page, data: this.myData(data) })
  }

  update (data) {
    !this.disconnected && this.socket.emit('new-data', this.myData(data))
  }

  sendError (err) {
    !this.disconnected && this.socket.emit('error-msg', err)
  }

  sendInfo (err) {
    !this.disconnected && this.socket.emit('info-msg', err)
  }

  reconnect (socket, data) {
    this.socket = socket
    this.disconnected = false
  }

  reconnectPage (data) {
    this.changePage(this.lastPage, this.myData(data))
  }

  won (q) {
    this.score++
    this.pairs.push({ q, a: this.picked })
  }

  switchCard (oldC, newC) {
    this.hand.splice(this.hand.indexOf(oldC), 1, newC)
    this.canChange = false
  }

  resetRound () {
    this.picked = null
    this.ready = false
  }

  myData (data) {
    return Object.assign(data, {
      hand: this.hand,
      self: Object.assign(
        this.toClient(), {
          canChange: this.canChange,
          hand: this.hand
        })
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

export default User