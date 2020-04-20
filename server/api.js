const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const rawDecks = require('../games/raw.json')

const availableDecks = [
  { name: 'Main CAU', decks: rawDecks.order.slice(0, 8) },
  { name: 'All CAU', decks: rawDecks.order.slice(0, 30) }
].concat(rawDecks.order.map(o => ({ name: rawDecks[o].name, decks: [o] })))

console.log(availableDecks)

const Room = require('./model/Room')
const User = require('./model/User')

const port = process.env.PORT || 4001
const index = require('./routes/index')

const app = express()
app.use(index)

const server = http.createServer(app)

const io = socketIo(server) // < Interesting!

const rooms = {}
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const generateCode = (length = 4) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const createUser = (name, socket) => new User(name, socket)

function createRoom (user, deck) {
  let roomName = generateCode()
  for (; rooms[roomName] !== undefined; roomName = generateCode());
  const room = new Room(roomName, user, generateDeck(deck))
  rooms[roomName] = room
  return room.toClient()
}

function joinRoom (roomName, user) {
  rooms[roomName].addUser(user)
  return rooms[roomName].toClient()
}

function generateDeck (deck) {
  let blackCards = []
  let whiteCards = []
  availableDecks[deck].decks.forEach(d => {
    blackCards = blackCards.concat(rawDecks[d].black.map(cId => rawDecks.blackCards[cId].text))
    whiteCards = whiteCards.concat(rawDecks[d].white.map(cId => rawDecks.whiteCards[cId]))
  })
  return {
    blackCards,
    whiteCards
  }
}

io.on('connection', socket => {
  console.log('New client connected')
  let myRoom = ''
  socket.on('create-room', (userName, deck) => {
    console.log('create-room', userName, deck)
    if (!userName || userName === '') {
      socket.emit('error-msg', 'Wrong username')
      return
    }
    myRoom = createRoom(createUser(userName, socket), deck).name
    socket.emit('change-page', {
      page: 'lobby',
      data: rooms[myRoom].toClient()
    })
  })
  socket.on('join-room', (roomName, userName) => {
    console.log('join-room', roomName, userName)
    if (!rooms[roomName]) {
      socket.emit('error-msg', 'Room doesn\'t exists')
      return
    }
    if (!userName || userName === '') {
      socket.emit('error-msg', 'Wrong username')
      return
    }
    if (rooms[roomName].users.filter(u => u.name === userName).length === 0) {
      myRoom = roomName
      socket.emit('change-page', {
        page: 'lobby',
        data: joinRoom(roomName, createUser(userName, socket))
      })
    } else {
      socket.emit('error-msg', 'User already in use')
    }
    // add an event on disconnect
  })
  socket.on('launch-game', () => {
    rooms[myRoom].startGame()
  })
  socket.on('choose-question', q => {
    rooms[myRoom].chooseQuestion(q)
  })
  socket.on('choose-answer', (u, a) => {
    rooms[myRoom].chooseAnswer(u, a)
  })
  socket.on('pick-answer', u => {
    rooms[myRoom].pickAnswer(u)
  })
  socket.on('ready', u => {
    rooms[myRoom].setReady(u)
  })
  socket.on('disconnect', () => console.log('Client disconnected'))

  socket.emit('available-decks', availableDecks)
})

server.listen(port, () => console.log(`Listening on port ${port}`))
