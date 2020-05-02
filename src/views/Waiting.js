import React from 'react'

import { Dq } from '../components/FilledQuestion'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import Users from '../components/Users'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Waiting for players</Title>
    <Dq>{server.question}</Dq>
    <Users showPicked showPicker />
  </FlexCM>
)))
