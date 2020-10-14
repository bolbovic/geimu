import { Socket } from 'socket.io'
import { RoomToClientLite } from './Room'
import Cliented from './Cliented'

interface Pair {
  q: string,
  a: string[]
}

interface UserToClient {
  disconnected: boolean,
  name: string,
  pairs: Pair[],
  picked: string[],
  ready: boolean,
  score: number
}

interface Self extends UserToClient {
  canChange: boolean,
  hand: string[]
}

interface SelfData extends RoomToClientLite {
  self: Self
}

class User extends Cliented {
  hand: string[]
  name: string
  score: number
  pairs: Pair[]
  socket: Socket
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

  changePage (page:string, data:RoomToClientLite) {
    this.lastPage = page
    !this.disconnected && this.socket.emit('change-page', { page, data: this.myData(data) })
  }

  update (data:RoomToClientLite) {
    !this.disconnected && this.socket.emit('new-data', this.myData(data))
  }

  sendError (err:string) {
    !this.disconnected && this.socket.emit('error-msg', err)
  }

  sendInfo (err:string) {
    !this.disconnected && this.socket.emit('info-msg', err)
  }

  reconnect (socket:Socket) {
    this.socket = socket
    this.disconnected = false
  }

  reconnectPage (data:RoomToClientLite) {
    this.changePage(this.lastPage, this.myData(data))
  }

  won (q:string) {
    this.score++
    this.pairs.push({ q, a: this.picked })
  }

  switchCard (oldC:string, newC:string) {
    this.hand.splice(this.hand.indexOf(oldC), 1, newC)
    this.canChange = false
  }

  resetRound () {
    this.picked = null
    this.ready = false
  }

  myData (data:RoomToClientLite) : SelfData {
    return Object.assign(data, {
      self: Object.assign(
        this.toClient(), {
          canChange: this.canChange,
          hand: this.hand
        })
    })
  }

  toClient () : UserToClient {
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
export { User, UserToClient }
