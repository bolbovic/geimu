import { extendObservable } from 'mobx'
import socketIOClient from 'socket.io-client'

export default class Server {
  constructor () {
    extendObservable(this, {
      answers: [],
      currentPage: '',
      data: {},
      decks: null,
      error: null,
      info: null,
      showingHand: false,
      serverReady: false,
      get choices () {
        return this.data.choices || []
      },
      get isMaster () {
        return this.data.master && this.userName === this.data.master.name
      },
      get isPicker () {
        return this.data.picker && this.data.picker.name === this.userName
      },
      get isReady () {
        return this.getUser(this.userName).ready
      },
      get hand () {
        return this.data.self ? this.data.self.hand : []
      },
      get numberOfAnswers () {
        const nb = this.data.question ? this.data.question.split('_').length : 1
        return nb > 1 ? nb - 1 : 1
      },
      get picker () {
        return this.data.picker || {}
      },
      get question () {
        return this.data.question || ''
      },
      get roomName () {
        return this.data.name
      },
      get userName () {
        return this.data.self ? this.data.self.name : ''
      },
      get users () {
        return this.data.users || []
      },
      get winner () {
        return this.data.winner || {}
      },
      get shuffledUsers () {
        return this.data.shuffledUsers || []
      },
      get bcLeft () {
        return this.data.blackCardsLeft
      },
      get self () {
        return this.data.self || {}
      },
      get wcLeft () {
        return this.data.whiteCardsLeft
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
      this.info = null
      this.error = null
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

  hideInfo () {
    this.info = null
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
    this.data = {}
    this.answers = []
    this.showingHand = false
    window.sessionStorage.removeItem('room-name')
    window.sessionStorage.removeItem('user-name')
  }

  stop () {
    this.socket.emit('quit-game')
    this.reset()
  }

  kick (u) {
    this.socket.emit('kick', u.name)
  }

  switchCard (c) {
    this.socket.emit('switch-card', c)
  }

  toggleHand () {
    this.showingHand = !this.showingHand
  }
}
