import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { RoundOutlinedButton } from './styles/Form'
import Icon from './Icon'

const B = styled(RoundOutlinedButton)`
`

export default inject('modals', 'server')(observer(({ modals, server }) => server.roomName ? (
  <B>
    <Icon
      icon='times'
      onClick={() => modals.showQuit()}
    />
  </B>
) : null))
