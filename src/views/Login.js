import React, { useState } from 'react'
import { inject } from 'mobx-react'

const NewGame = inject('server')(({ server }) => {
  const [userName, setUserName] = useState('')
  return (
    <div>
      <div>
        <label>UserName</label>
        <input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </div>
      <button onClick={() => server.createRoom(userName)}>New Game</button>
    </div>
  )
})

const JoinGame = inject('server')(({ server }) => {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  return (
    <div>
      <div>
        <label>UserName</label>
        <input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </div>
      <div>
        <label>Room ID</label>
        <input onChange={e => setRoomName(e.target.value)} value={roomName} name='roomName' type='text' />
      </div>
      <button onClick={() => server.joinRoom(roomName, userName)}>Join Game</button>
    </div>
  )
})

export default inject('server')(({ server }) => (
  <div>
    <NewGame />
    <JoinGame />
  </div>
))
