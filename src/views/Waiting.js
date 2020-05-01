import React from 'react'

import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import Users from '../components/Users'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Waiting for players</Title>
    <div>{server.question}</div>
    <Users showPicked showPicker />
  </FlexCM>
)))
