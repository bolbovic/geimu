import React from 'react'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { RoundOutlinedButton } from './styles/Form'

const B = styled(RoundOutlinedButton)`
  position: fixed;
  right:0;
`

export default inject('modals', 'server')(observer(({ modals, server }) => server.roomName ? (
  <B>
    <FontAwesomeIcon
      icon='times'
      onClick={() => modals.showQuit()}
    />
  </B>
) : null))
