import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'

import { Flex, FlexC, FlexCM, FlexH } from '../components/styles/Flex'
import { Button, ButtonOulineRM, Input, Label, Select } from '../components/styles/Form'

const DeckSelect = ({ decks, onChange, selected }) => (
  <Select name='decks' onClick={e => onChange(e.target.value)} selected={selected}>
    {decks.map(d => <option value={d.value} key={d.value}>{d.name}</option>)}
  </Select>
)

const NewGame = inject('server')(observer(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [deck, setDeck] = useState(0)
  return (
    <FlexCM>
      <FlexC>
        <Label>Nickname</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexC>
      {server.decks ? (
        <FlexC>
          <Label>Deck</Label>
          <DeckSelect decks={server.decks.map((d, i) => ({ name: d.name, value: i }))} onChange={d => setDeck(d)} selected={deck} />
        </FlexC>
      ) : null}
      <FlexH>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.createRoom(userName, deck)}>New Game</Button>
      </FlexH>
    </FlexCM>
  )
}))

const JoinGame = inject('server')(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  return (
    <FlexCM>
      <FlexC>
        <Label>UserName</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexC>
      <FlexC>
        <Label>Room ID</Label>
        <Input onChange={e => setRoomName(e.target.value)} value={roomName} name='roomName' type='text' />
      </FlexC>
      <FlexH>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.joinRoom(roomName, userName)}>Join Game</Button>
      </FlexH>
    </FlexCM>
  )
})

export default inject('server')(({ server }) => {
  const [show, setShow] = useState('')
  const back = () => { setShow('') }
  return (
    <FlexCM>
      {show === 'new'
        ? <NewGame back={back} />
        : show === 'join'
          ? <JoinGame back={back} />
          : (
            <FlexC>
              <Button style={{ marginBottom: '40px' }} onClick={() => setShow('new')}>New Game</Button>
              <Button onClick={() => setShow('join')}>Join Game</Button>
            </FlexC>
          )}
    </FlexCM>
  )
})
