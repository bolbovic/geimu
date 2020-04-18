const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

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

function createRoom (user) {
  let roomName = generateCode()
  for (; rooms[roomName] !== undefined; roomName = generateCode());
  const room = new Room(roomName, user)
  rooms[roomName] = room
  return room.toClient()
}

function joinRoom (roomName, user) {
  rooms[roomName].addUser(user)
  return rooms[roomName].toClient()
}

io.on('connection', socket => {
  console.log('New client connected')
  let myRoom = ''
  socket.on('create-room', userName => {
    console.log('create-room', userName)
    myRoom = createRoom(createUser(userName, socket)).name
    socket.emit('change-page', {
      page: 'lobby',
      data: rooms[myRoom].toClient()
    })
  })
  socket.on('launch-game', () => {
    rooms[myRoom].startGame()
  })
  socket.on('join-room', (roomName, userName) => {
    console.log('join-room', roomName, userName)
    myRoom = roomName
    socket.emit('change-page', {
      page: 'lobby',
      data: joinRoom(roomName, createUser(userName, socket))
    })
    // add an event on disconnect
  })
  socket.on('disconnect', () => console.log('Client disconnected'))
})

server.listen(port, () => console.log(`Listening on port ${port}`))
