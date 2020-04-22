import { extendObservable } from 'mobx'
import socketIOClient from 'socket.io-client'

export default class Server {
  constructor () {
    extendObservable(this, {
      currentPage: '',
      data: {},
      decks: null,
      error: '',
      serverReady: false,
      get isMaster () {
        return this.data.master && this.userName === this.data.master.name
      },
      get isPicker () {
        return this.data.picker && this.data.picker.name === this.userName
      },
      get isReady () {
        return this.getUser(this.userName).ready
      },
      get userName () {
        return this.data.self ? this.data.self.name : ''
      },
      get roomName () {
        return this.data.name
      },
      get numberOfAnswers () {
        const nb = this.data.question ? this.data.question.split('_').length : 1
        return nb > 1 ? nb - 1 : 1
      },
      get hand () {
        return this.data.self ? this.data.self.hand : []
      },
      get picker () {
        return this.data.picker || {}
      }
    })
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
      this.error = null
      window.sessionStorage.setItem('room-name', this.roomName)
      window.sessionStorage.setItem('user-name', this.userName)
    })
    this.socket.on('error-reconnect', msg => {
      this.serverReady = true
      this.error = msg
      this.currentPage = ''
      window.sessionStorage.removeItem('room-name')
      window.sessionStorage.removeItem('user-name')
    })
    this.socket.on('new-data', data => {
      console.log('new-data received...', data)
      this.data = data
      this.error = null
    })
    this.socket.on('available-decks', decks => {
      console.log('available-decks received...', decks)
      this.decks = decks
    })
    this.socket.on('error-msg', error => { this.error = error })
    this.socket.on('disconnect', reason => {
      this.currentPage = ''
      this.error = 'Disconnected from server'
    })
  }

  getUser (name) {
    let uu = {};
    (this.data.users || []).forEach(u => {
      if (name === u.name) uu = u
    })
    return uu
  }

  hideNotification () {
    this.error = null
  }

  createRoom (userName, deck) {
    console.log('creating room...')
    this.socket.emit('create-room', userName, deck)
  }

  joinRoom (roomName, userName) {
    console.log('joining room...')
    this.socket.emit('join-room', roomName, userName)
  }

  launchGame () {
    this.socket.emit('launch-game', this.data.name)
  }

  chooseQuestion (q) {
    this.socket.emit('choose-question', q)
  }

  chooseAnswer (a) {
    this.socket.emit('choose-answer', this.userName, a)
  }

  pickAnswer (u) {
    this.socket.emit('pick-answer', u.name)
  }

  ready () {
    this.socket.emit('ready', this.userName)
  }
}
