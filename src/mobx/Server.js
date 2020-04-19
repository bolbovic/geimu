import { extendObservable } from 'mobx'
import socketIOClient from 'socket.io-client'

export default class Server {
  constructor () {
    extendObservable(this, {
      currentPage: '',
      data: {},
      userName: '',
      get isMaster () {
        return this.data.master ? this.userName === this.data.master.name : false
      }
    })
    this.socket = socketIOClient('http://127.0.0.1:4001')
    this.socket.on('change-page', data => {
      console.log('change-page received...', data)
      this.currentPage = data.page
      this.data = data.data
    })
    this.socket.on('new-data', data => {
      console.log('new-data received...', data)
      this.data = data
    })
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
}
