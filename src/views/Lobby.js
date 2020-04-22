import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { PB10 } from '../components/styles/Divs'
import { FlexC, FlexCM } from '../components/styles/Flex'
import { Button } from '../components/styles/Form'
import { Title } from '../components/styles/Texts'

const RoomCode = styled.h1`
  color: #b58900;
  letter-spacing: 5px;
  font-size: 2.5em;
`

const User = ({ user }) => (
  <div>{user.name}</div>
)

const UsersDiv = styled(FlexC)`
  div {
    margin-bottom: 10px;
  }
  div:last-child {
    margin-bottom: 0;
  }
  width: auto;
`
const Users = inject('server')(observer(({ server }) => (
  <UsersDiv>
    {(server.data.users || []).map((u, i) => <User key={i} user={u} />)}
  </UsersDiv>
)))

const TextPad20 = styled.div`
  padding: 20px;
  text-align: center;
`

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <div>Welcome to</div>
    <Title>Bolbo Geimuzu</Title>
    <TextPad20>You might want to share the following code to your friends so they can play with you that magnificent game.<br />Have fun ;)</TextPad20>
    <RoomCode>{server.data.name}</RoomCode>
    <FlexC>
      <PB10>Users already connected</PB10>
      <Users />
    </FlexC>
    {server.isMaster && server.data.users && server.data.users.length > 2 ? <Button onClick={() => server.launchGame()}>Launch</Button> : null}
  </FlexCM>
)))
