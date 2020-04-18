import { extendObservable } from 'mobx'
import socketIOClient from 'socket.io-client'

export default class Server {
  constructor () {
    extendObservable(this, {
      currentPage: '',
      data: {}
    })
    this.socket = socketIOClient('http://127.0.0.1:4001')
    this.socket.on('change-page', data => {
      console.log('change-page received...')
      this.currentPage = data.page
      this.data = data.data
    })
    this.socket.on('new-data', data => {
      console.log('new-data received...')
      this.data = data
    })
  }

  createRoom (userName) {
    console.log('creating room...')
    this.socket.emit('create-room', userName)
  }

  joinRoom (roomName, userName) {
    console.log('joining room...')
    this.socket.emit('join-room', roomName, userName)
  }
}
