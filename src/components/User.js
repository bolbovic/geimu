import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { FlexH } from './styles/Flex'

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

export default ({ showScore, showPicked, showReady, user }) => (
  <User>
    <UserName>{user.name}{user.disconnected ? <Small>- disconnected</Small> : null}</UserName>
    {showScore ? <div>{user.score}</div> : null}
    {showPicked ? <FontAwesomeIcon spin={!user.picked} icon={user.picked ? 'check-circle' : 'spinner'} /> : null}
    {showReady ? <FontAwesomeIcon spin={!user.ready} icon={user.ready ? 'check-circle' : 'spinner'} /> : null}
  </User>
)
