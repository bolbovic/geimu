import React from 'react'
import { inject, observer } from 'mobx-react'

import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import { UserText } from '../components/User'
import Users from '../components/Users'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Scoreboard</Title>
    <div>Waiting for <UserText>{server.picker.name}</UserText> to pick a question.</div>
    <Users showScore />
  </FlexCM>
)))
