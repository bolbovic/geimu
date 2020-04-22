import React from 'react'
import styled from 'styled-components'

import { FlexH } from './styles/Flex'

const User = styled(FlexH)`
  font-size: larger;
  justify-content: space-between;
  width: 100%;
`

const Small = styled.span`
  color: #dc322f;
  font-size: smaller;
  font-style: italic;
  padding-left: 5px;
`

export default ({ user }) => (
  <User>
    <FlexH>{user.name}{user.disconnected ? <Small>- disconnected</Small> : null}</FlexH>
    <div>{user.score}</div>
  </User>
)
