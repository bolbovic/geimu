import { extendObservable } from 'mobx'
import socketIOClient from 'socket.io-client'

export default class Server {
  constructor () {
    extendObservable(this, {
      currentPage: '',
      data: {},
      userName: '',
      error: null,
      get isMaster () {
        return this.data.master && this.userName === this.data.master.name
      },
      get isPicker () {
        return this.data.picker && this.data.picker.name === this.userName
      },
      get isReady () {
        return this.getUser(this.userName).ready
      }
    })
    this.socket = socketIOClient('http://127.0.0.1:4001')
    this.socket.on('change-page', data => {
      console.log('change-page received...', data)
      this.currentPage = data.page
      this.data = data.data
      this.error = null
    })
    this.socket.on('new-data', data => {
      console.log('new-data received...', data)
      this.data = data
      this.error = null
    })
    this.socket.on('error-msg', error => { this.error = error })
  }

  getUser (name) {
    let uu = {};
    (this.data.users || []).forEach(u => {
      if (name === u.name) uu = u
    })
    return uu
  }

  createRoom (userName) {
    console.log('creating room...')
    this.userName = userName
    this.socket.emit('create-room', userName)
  }

  joinRoom (roomName, userName) {
    console.log('joining room...')
    this.userName = userName
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
