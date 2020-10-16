import { computed, decorate, observable } from 'mobx'
import socketIOClient, { Socket }  from 'socket.io-client'

interface Pair {
  q: string,
  a: string[]
}

interface User {
  disconnected: boolean
  name: string
  pairs: Pair[]
  picked: string[]
  ready: boolean
  score: number
}

interface Self extends User {
  canChange: boolean
  hand: string[]
}

interface Room {
  blackCardsLeft: number
  choices: string[]
  master: User
  name: string
  picker: User
  question: string
  self: Self
  shuffledUsers: User[]
  users: User[]
  whiteCardsLeft: number
  winner: User
}

interface Deck {
  cards: number,
  name: string,
  decks: string[]
}

const EmptyUser = {
  disconnected: false,
  name: '',
  pairs: [],
  picked: [],
  ready: false,
  score: 0
}

const EmptySelf = Object.assign({
  canChange: false,
  hand: []
}, EmptyUser)

const EmptyRoom = {
  blackCardsLeft: 0,
  choices: [],
  master: EmptyUser,
  name: '',
  picker: EmptyUser,
  question: '',
  self: EmptySelf,
  shuffledUsers: [],
  users: [],
  winner: EmptyUser,
  whiteCardsLeft: 0
}

class Server {
  answers: string[]
  currentPage: string
  data: Room
  decks: Deck[]
  error: string
  info: string
  showingHand: boolean
  serverReady: boolean
  socket: Socket
  constructor () {
    this.answers = []
    this.currentPage = ''
    this.data = EmptyRoom
    this.decks = []
    this.error = ''
    this.info = ''
    this.showingHand = false
    this.serverReady = false
    this.socket = socketIOClient(process.env.REACT_APP_API_SERVER)
    this.socket.on('connect', () => {
      console.log('just got connected')
      // checked if in a middle of a game
      const roomName = window.sessionStorage.getItem('room-name')
      const userName = window.sessionStorage.getItem('user-name')
      if (roomName && userName) {
        this.socket.emit('try-reconnect', roomName, userName)
      } else {
        this.serverReady = true
      }
    })
    this.socket.on('change-page', data => {
      console.log('change-page received...', data)
      this.currentPage = data.page
      this.data = data.data
      this.serverReady = true
      this.info = ''
      this.error = ''
      window.sessionStorage.setItem('room-name', this.roomName)
      window.sessionStorage.setItem('user-name', this.userName)
      if (data.page === 'answers') {
        this.showingHand = false
      }
      if (data.page === 'lobby') {
        this.showingHand = false
      }
      if (data.page === 'pick-answer') {
        this.showingHand = true
      }
    })
    this.socket.on('error-reconnect', msg => {
      this.serverReady = true

      this.error = msg
      this.reset()
    })
    this.socket.on('new-data', data => {
      console.log('new-data received...', data)
      this.data = data
    })
    this.socket.on('available-decks', decks => {
      console.log('available-decks received...', decks)
      this.decks = decks
    })
    this.socket.on('error-msg', error => { this.error = error })
    this.socket.on('info-msg', info => { this.info = info })
    this.socket.on('disconnect', reason => {
      this.currentPage = ''
      this.error = 'Disconnected from server'
    })
  }

  getUser (name:string): User | null {
    this.data.users.forEach(u => {
      if (name === u.name)
        return u
    })
    return null
  }

  hideNotification () {
    this.error = ''
  }

  hideInfo () {
    this.info = ''
  }

  createRoom (userName:string, deck:number) {
    this.socket.emit('create-room', userName, deck)
  }

  joinRoom (roomName:string, userName:string) {
    this.socket.emit('join-room', roomName, userName)
  }

  launchGame () {
    this.socket.emit('launch-game', this.data.name)
  }

  chooseQuestion (q) {
    this.socket.emit('choose-question', q)
  }

  chooseAnswers () {
    this.socket.emit('choose-answer', this.answers)
    this.answers = []
  }

  pickAnswer (u) {
    this.socket.emit('pick-answer', u.name)
  }

  ready () {
    this.socket.emit('ready')
  }

  answerClicked (card) {
    const idx = this.answers.indexOf(card)
    if (idx !== -1) {
      this.answers.splice(idx, 1)
    } else {
      this.answers.push(card)
    }
  }

  resetAnswers () {
    this.answers = []
  }

  reset () {
    this.currentPage = ''
    this.data = EmptyRoom
    this.answers = []
    this.showingHand = false
    window.sessionStorage.removeItem('room-name')
    window.sessionStorage.removeItem('user-name')
  }

  stop () {
    this.socket.emit('quit-game')
    this.reset()
  }

  kick (u:User) {
    this.socket.emit('kick', u.name)
  }

  switchCard (c) {
    this.socket.emit('switch-card', c)
  }

  toggleHand () {
    this.showingHand = !this.showingHand
  }

  get choices () {
    return this.data.choices || []
  }
  get isMaster () {
    return this.data.master && this.userName === this.data.master.name
  }
  get isPicker () {
    return this.data.picker && this.data.picker.name === this.userName
  }
  get isReady () {
    return this.data.self.ready
  }
  get hand () {
    return this.data.self ? this.data.self.hand : []
  }
  get numberOfAnswers () {
    const nb = this.data.question ? this.data.question.split('_').length : 1
    return nb > 1 ? nb - 1 : 1
  }
  get picker () {
    return this.data.picker || {}
  }
  get question () {
    return this.data.question || ''
  }
  get roomName () {
    return this.data.name
  }
  get userName () {
    return this.data.self ? this.data.self.name : ''
  }
  get users () {
    return this.data.users || []
  }
  get winner () {
    return this.data.winner || {}
  }
  get shuffledUsers () {
    return this.data.shuffledUsers || []
  }
  get bcLeft () {
    return this.data.blackCardsLeft
  }
  get self () {
    return this.data.self || {}
  }
  get wcLeft () {
    return this.data.whiteCardsLeft
  }
}

decorate(Server, {
  answers: observable,
  currentPage: observable,
  data: observable,
  decks: observable,
  error: observable,
  info: observable,
  showingHand: observable,
  serverReady: observable,
  choices: computed,
  isMaster: computed,
  isPicker: computed,
  isReady: computed,
  hand: computed,
  numberOfAnswers: computed,
  picker: computed,
  question: computed,
  roomName: computed,
  userName: computed,
  users: computed,
  winner: computed,
  shuffledUsers: computed,
  bcLeft: computed,
  self: computed,
  wcLeft: computed
})

export default Server