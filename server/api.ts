import Room from './model/Room'
import User from './model/User'

import { Server as SocketServer, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { Express } from 'express'

import express = require('express')
import http = require('http')
import path = require('path')
import socketIo = require('socket.io')

interface BlackCard extends Object {
  pick: string,
  text: string
}

interface RawDecks {
  blackCards: BlackCard[]
  whiteCards: string[]
}

const rawDecks:RawDecks = require('../data/raw.json')
const order = ['Base', 'CAHe1', 'CAHe2', 'CAHe3', 'CAHe4', 'CAHe5', 'CAHe6', 'greenbox', '90s', 'Box', 'fantasy', 'food', 'science', 'www', 'hillary', 'trumpvote', 'trumpbag', 'xmas2012', 'xmas2013', 'PAXE2013', 'PAXP2013', 'PAXE2014', 'PAXEP2014', 'PAXPP2014', 'PAX2015', 'HOCAH', 'reject', 'reject2', 'Canadian', 'misprint', 'apples', 'crabs', 'matrimony', 'c-tg', 'c-admin', 'c-anime', 'c-antisocial', 'c-equinity', 'c-homestuck', 'c-derps', 'c-doctorwho', 'c-eurovision', 'c-fim', 'c-gamegrumps', 'c-golby', 'GOT', 'CAHgrognards', 'HACK', 'Image1', 'c-ladies', 'c-imgur', 'c-khaos', 'c-mrman', 'c-neindy', 'c-nobilis', 'NSFH', 'c-northernlion', 'c-ragingpsyfag', 'c-stupid', 'c-rt', 'c-rpanons', 'c-socialgamer', 'c-sodomydog', 'c-guywglasses', 'c-vewysewious', 'c-vidya', 'c-xkcd', 'dodgeball-g1', 'dodgeball-g2', 'peptides', 'CAHeFR', 'NaabsFR']

interface RawDeck {
  cards: number,
  name: string,
  decks: string[]
}

const countCards = (decks:string[]):number => {
  return decks.reduce((t, d) => t + rawDecks[d].white.length + rawDecks[d].black.length, 0)
}

const availableDecks:RawDeck[] = [
  { name: 'Main CAH', decks: order.slice(0, 8), cards: countCards(order.slice(0, 8)) },
  { name: 'All CAH', decks: order.slice(0, 30), cards: countCards(order.slice(0, 30)) },
  { name: 'Dodgeball Gen 1 & Main CAH', decks: ['Base', 'CAHe1', 'CAHe2', 'CAHe3', 'CAHe4', 'CAHe5', 'CAHe6', 'dodgeball-g1'], cards: countCards(['Base', 'CAHe1', 'CAHe2', 'CAHe3', 'CAHe4', 'CAHe5', 'CAHe6', 'dodgeball-g1']) },
  { name: 'Dodgeball Gen 1 & Base', decks: ['Base', 'dodgeball-g1'], cards: countCards(['Base', 'dodgeball-g1']) },
  { name: 'Dodgeball Gen 1 & Gen 2 & Base', decks: ['Base', 'dodgeball-g1', 'dodgeball-g2'], cards: countCards(['Base', 'dodgeball-g1', 'dodgeball-g2']) },
  { name: 'Dodgeball Gen 2 & Base', decks: ['Base', 'dodgeball-g2'], cards: countCards(['Base', 'dodgeball-g2']) },
  { name: 'Peptides', decks: ['Base', 'peptides'], cards: countCards(['Base', 'peptides']) },
  { name: 'All FR', decks: order.slice(-2), cards: countCards(order.slice(-2)) }
].concat(order.map(o => ({
  name: rawDecks[o].name,
  cards: countCards([o]),
  decks: [o]
})))

const port = process.env.PORT || 4001

const app:Express = express()
app.use(express.static(path.join(__dirname, '..', '/build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/index.html'))
})

const server:HttpServer = http.createServer(app)

const io:SocketServer = socketIo(server) // < Interesting!

const rooms:Object = {}
const chars:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const generateCode:Function = (length = 4):string => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const createUser:Function = (name: string, socket: Socket) : User => new User(name, socket)

function createRoom (user:User, deck:number):any {
  let roomName = generateCode()
  for (; rooms[roomName] !== undefined; roomName = generateCode());
  const room = new Room(roomName, user, generateDeck(deck))
  rooms[roomName] = room
  return room.toClient()
}

function checkIfFantom (roomName:string):void {
  let b = true
  rooms[roomName].users.forEach(u => {
    b = b && u.disconnected
  })
  if (b) {
    console.log(`Deleting room ${roomName}`)
    delete rooms[roomName]
  }
}

interface Deck {
  blackCards: string[],
  whiteCards: string[]
}

function generateDeck (deck:number):Deck {
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

io.on('connection', (socket:Socket) => {
  console.log('New client connected')
  let myRoom = ''
  let myUserName = ''
  socket.on('create-room', (userName:string, deck:number) => {
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
  socket.on('join-room', (roomName:string, userName:string) => {
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
  socket.on('choose-question', (q:string) => {
    rooms[myRoom].chooseQuestion(q, myUserName)
  })
  socket.on('choose-answer', (a:string[]) => {
    rooms[myRoom].chooseAnswer(myUserName, a)
  })
  socket.on('pick-answer', (u:string) => {
    rooms[myRoom].pickAnswer(u)
  })
  socket.on('ready', () => {
    rooms[myRoom].setReady(myUserName)
  })
  socket.on('switch-card', (c:string) => {
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
