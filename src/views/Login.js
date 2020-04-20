import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'

const DeckSelect = ({ decks, onChange, selected }) => (
  <select name='decks' onClick={e => onChange(e.target.value)} selected={selected}>
    {decks.map(d => <option value={d.value} key={d.value}>{d.name}</option>)}
  </select>
)

const NewGame = inject('server')(observer(({ server }) => {
  const [userName, setUserName] = useState('')
  const [deck, setDeck] = useState(0)
  return (
    <div>
      <div>
        <label>UserName</label>
        <input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </div>
      <div>
        {server.decks ? <DeckSelect decks={server.decks.map((d, i) => ({ name: d.name, value: i }))} onChange={d => setDeck(d)} selected={deck} /> : null}
      </div>
      <button onClick={() => server.createRoom(userName, deck)}>New Game</button>
    </div>
  )
}))

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
