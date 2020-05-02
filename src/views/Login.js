import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Flex, FlexCM, FlexCCM, FlexH } from '../components/styles/Flex'
import { Button, ButtonOulineRM, Input, Label, Select } from '../components/styles/Form'
import { Title } from '../components/styles/Texts'

const DeckSelect = ({ decks, onChange, selected }) => (
  <Select name='decks' onClick={e => onChange(e.target.value)} selected={selected}>
    {decks.map(d => <option value={d.value} key={d.value}>{d.name}</option>)}
  </Select>
)

const NewGame = inject('server')(observer(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [deck, setDeck] = useState(0)
  return (
    <FlexCCM>
      <FlexCM>
        <Label>Nickname</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexCM>
      {server.decks ? (
        <FlexCM>
          <Label>Deck</Label>
          <DeckSelect decks={server.decks.map((d, i) => ({ name: `${d.name} [${d.cards}]`, value: i }))} onChange={d => setDeck(d)} selected={deck} />
        </FlexCM>
      ) : null}
      <FlexH>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.createRoom(userName, deck)}>New Game</Button>
      </FlexH>
    </FlexCCM>
  )
}))

const JoinGame = inject('server')(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  return (
    <FlexCCM>
      <FlexCM>
        <Label>UserName</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexCM>
      <FlexCM>
        <Label>Room ID</Label>
        <Input onChange={e => setRoomName(e.target.value.toUpperCase())} value={roomName} name='roomName' type='text' />
      </FlexCM>
      <FlexH>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.joinRoom(roomName, userName)}>Join Game</Button>
      </FlexH>
    </FlexCCM>
  )
})

const Login = styled(FlexCCM)`
  > div, > h1 {
    text-align: center;
    width: 80%;
  }
`

const Welcomu = styled(Flex)`
  height: 100%;
`

export default inject('server')(({ server }) => {
  const [show, setShow] = useState('')
  const back = () => { setShow('') }
  return (
    <Login>
      {show === 'new'
        ? <NewGame back={back} />
        : show === 'join'
          ? <JoinGame back={back} />
          : (
            <Welcomu>
              <Title>Welcome to Bolubo Geimuzu</Title>
              <div>Please avoid using Firefox and Safari/iPhone for now... Fixes are coming soonTM...</div>
              <div>Start by creating a game or join the room of an existing game!</div>
              <div>&nbsp;</div>
              <Button style={{ marginBottom: '40px' }} onClick={() => setShow('new')}>New Game</Button>
              <Button onClick={() => setShow('join')}>Join Game</Button>
            </Welcomu>
          )}
    </Login>
  )
})
