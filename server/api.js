const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

const rawDecks = require('../data/raw.json')
const order = ['Base', 'CAHe1', 'CAHe2', 'CAHe3', 'CAHe4', 'CAHe5', 'CAHe6', 'greenbox', '90s', 'Box', 'fantasy', 'food', 'science', 'www', 'hillary', 'trumpvote', 'trumpbag', 'xmas2012', 'xmas2013', 'PAXE2013', 'PAXP2013', 'PAXE2014', 'PAXEP2014', 'PAXPP2014', 'PAX2015', 'HOCAH', 'reject', 'reject2', 'Canadian', 'misprint', 'apples', 'crabs', 'matrimony', 'c-tg', 'c-admin', 'c-anime', 'c-antisocial', 'c-equinity', 'c-homestuck', 'c-derps', 'c-doctorwho', 'c-eurovision', 'c-fim', 'c-gamegrumps', 'c-golby', 'GOT', 'CAHgrognards', 'HACK', 'Image1', 'c-ladies', 'c-imgur', 'c-khaos', 'c-mrman', 'c-neindy', 'c-nobilis', 'NSFH', 'c-northernlion', 'c-ragingpsyfag', 'c-stupid', 'c-rt', 'c-rpanons', 'c-socialgamer', 'c-sodomydog', 'c-guywglasses', 'c-vewysewious', 'c-vidya', 'c-xkcd', 'dodgeball', 'peptides', 'CAHeFR', 'NaabsFR']

const countCards = decks => {
  return decks.reduce((t, d) => parseInt(t) + rawDecks[d].white.length + rawDecks[d].black.length, 0)
}

const availableDecks = [
  { name: 'Main CAH', decks: order.slice(0, 8), cards: countCards(order.slice(0, 8)) },
  { name: 'All CAH', decks: order.slice(0, 30), cards: countCards(order.slice(0, 30)) },
  { name: 'Dodgeball & Base', decks: ['Base', 'dodgeball'], cards: countCards(['Base', 'dodgeball']) },
  { name: 'Peptides', decks: ['Base', 'peptides'], cards: countCards(['Base', 'peptides']) },
  { name: 'All FR', decks: order.slice(-2), cards: countCards(order.slice(-2)) }
].concat(order.map(o => ({
  name: rawDecks[o].name,
  cards: countCards([o]),
  decks: [o]
})))

const Room = require('./model/Room')
const User = require('./model/User')

const port = process.env.PORT || 4001

const app = express()
app.use(express.static(path.join(__dirname, '..', '/build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/index.html'))
})

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

function checkIfFantom (roomName) {
  let b = true
  rooms[roomName].users.forEach(u => {
    b = b && u.disconnected
  })
  b && console.log(`Deleting room ${roomName}`) && delete rooms[roomName]
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
  let myUserName = ''
  socket.on('create-room', (userName, deck) => {
    console.log('create-room', userName, deck)
    if (!userName || userName === '') {
      socket.emit('error-msg', 'Wrong username')
      return
    }
    myRoom = createRoom(createUser(userName, socket), deck).name
    myUserName = userName
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
    if (!rooms[roomName].getUser(userName)) {
      myRoom = roomName
      myUserName = userName
      rooms[roomName].userJoins(createUser(userName, socket))
    } else {
      if (rooms[roomName].getUser(userName).disconnected) {
        if (rooms[roomName].tryReconnect(userName, socket)) {
          myRoom = roomName
          myUserName = userName
        } else {
          socket.emit('error-reconnect', 'Impossible to reconnect')
        }
      } else {
        socket.emit('error-msg', 'User already in use')
      }
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
  socket.on('switch-card', c => {
    rooms[myRoom].switchCard(myUserName, c)
  })
  socket.on('disband-game', () => {
    rooms[myRoom].disband(myUserName)
  })
  socket.on('kick', userName => {
    rooms[myRoom].kick(userName)
  })
  socket.on('quit-game', () => {
    rooms[myRoom].quit(myUserName)
    checkIfFantom(myRoom)
    myRoom = ''
    myUserName = ''
  })
  socket.on('try-reconnect', (r, u) => {
    console.log('try-reconnecting', r, u)
    if (rooms[r] && rooms[r].tryReconnect(u, socket)) {
      myRoom = r
      myUserName = u
    } else {
      socket.emit('error-reconnect', 'Impossible to reconnect')
    }
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected', myRoom, myUserName)
    if (myRoom) {
      rooms[myRoom].userDisconnected(myUserName)
      checkIfFantom(myRoom)
    }
  })

  socket.emit('available-decks', availableDecks)
})

server.listen(port, () => console.log(`Listening on port ${port}`))
