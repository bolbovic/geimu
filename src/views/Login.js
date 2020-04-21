import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { FlexC } from '../components/styles/Flex'

const Button = styled.button`
  background-color: #d33682;
  border: none;
  border-radius: 10px;
  color: #fdf6e3;
  height: 40px;
  text-decoration: none;
  text-transform: uppercase;
  width: 120px;
`

const ButtonOutline = styled(Button)`
  background-color: transparent;
  border: 3px solid #d33682;
`

const ButtonOulineRM = styled(ButtonOutline)`
  margin-right: 20px;
`

const FlexCC = styled(FlexC)`
  flex-direction: column;
  width: 100%;
`

const Input = styled.input`
  background: #839496;
  border: none;
  border-radius: 10px;
  color: #073642;
  padding: 10px;
  text-shadow: none;
  width: 280px;
`

const Select = styled.select`
  background: #839496;
  border: none;
  border-radius: 10px;
  color: #073642;
  padding: 10px;
  text-shadow: none;
  width: 300px;
`

const Option = styled.option`
  width: 300px;
`

const DeckSelect = ({ decks, onChange, selected }) => (
  <Select name='decks' onClick={e => onChange(e.target.value)} selected={selected}>
    {decks.map(d => <Option value={d.value} key={d.value}>{d.name}</Option>)}
  </Select>
)

const Label = styled.label`
  margin-bottom: 10px;
`

const FlexCCM = styled(FlexCC)`
  div {
    margin-bottom: 20px;
  }
  div:last-child {
    margin-bottom: 0;
  }
`
const NewGame = inject('server')(observer(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [deck, setDeck] = useState(0)
  return (
    <FlexCCM>
      <FlexCC>
        <Label>Nickname</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexCC>
      {server.decks ? (
        <FlexCC>
          <Label>Deck</Label>
          <DeckSelect decks={server.decks.map((d, i) => ({ name: d.name, value: i }))} onChange={d => setDeck(d)} selected={deck} />
        </FlexCC>
      ) : null}
      <FlexC>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.createRoom(userName, deck)}>New Game</Button>
      </FlexC>
    </FlexCCM>
  )
}))

const JoinGame = inject('server')(({ back, server }) => {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  return (
    <FlexCCM>
      <FlexCC>
        <Label>UserName</Label>
        <Input onChange={e => setUserName(e.target.value)} value={userName} name='userName' type='text' />
      </FlexCC>
      <FlexCC>
        <Label>Room ID</Label>
        <Input onChange={e => setRoomName(e.target.value)} value={roomName} name='roomName' type='text' />
      </FlexCC>
      <FlexC>
        <ButtonOulineRM onClick={back}>Back</ButtonOulineRM>
        <Button onClick={() => server.joinRoom(roomName, userName)}>Join Game</Button>
      </FlexC>
    </FlexCCM>
  )
})

export default inject('server')(({ server }) => {
  const [show, setShow] = useState('new')
  const back = () => { setShow('') }
  return (
    <FlexCC>
      {show === 'new'
        ? <NewGame back={back} />
        : show === 'join'
          ? <JoinGame back={back} />
          : (
            <FlexCC>
              <Button style={{ marginBottom: '40px' }} onClick={() => setShow('new')}>New Game</Button>
              <Button onClick={() => setShow('join')}>Join Game</Button>
            </FlexCC>
          )}
    </FlexCC>
  )
})
