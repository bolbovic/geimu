import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'

import { FlexH } from './styles/Flex'
import Icon from './Icon'

const User = styled(FlexH)`
  font-size: larger;
  width: 100%;
  svg {
    margin-left: 10px;
  }
`

const Small = styled.span`
  color: #dc322f;
  font-size: smaller;
  font-style: italic;
  padding-left: 5px;
`

const UserName = styled(FlexH)`
  flex-grow: 1;
`

const UserStatus = inject('modals', 'server')(observer(({ modals, property, server, user }) => {
  const k = user.disconnected && server.isMaster
  return (
    <Icon
      icon={k ? 'user-slash' : user[property] ? 'check-circle' : 'spinner'}
      onClick={k ? () => modals.showKick(user) : null}
      spin={!user[property] && !k}
      style={{ cursor: k ? 'pointer' : 'default' }}
    />
  )
}))

export const UserText = styled.span`
  color: #d33682;
  font-size: bigger;
`

export default ({ isPicker, isWinner, showScore, showPicked, showReady, user }) => (
  <User>
    <UserName>{isPicker || isWinner ? <UserText>{user.name}</UserText> : user.name}{user.disconnected ? <Small>- disconnected</Small> : null}</UserName>
    {showScore ? <div>{user.score}</div> : null}
    {showPicked ? <UserStatus property='picked' user={user} /> : null}
    {showReady ? <UserStatus property='ready' user={user} /> : null}
  </User>
)
