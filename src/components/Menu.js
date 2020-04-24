import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { FlexH } from './styles/Flex'
import Quit from './Quit'

const Menu = styled(FlexH)`
  justify-content: space-between;
  max-width: 500px;
  position: fixed;
  top: 0;
  width: 100%;
`

export default inject('modals', 'server')(observer(({ modals, server }) => server.roomName ? (
  <Menu>
    <div>{`B: ${server.bcLeft || 0} - W: ${server.wcLeft || 0}`}</div>
    <div>{server.roomName}</div>
    <Quit />
  </Menu>
) : null))
