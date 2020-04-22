import React from 'react'
import { inject, observer } from 'mobx-react'

import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import Users from '../components/Users'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Scoreboard</Title>
    <div>{`Waiting for ${server.picker.name} to pick a question.`}</div>
    <Users showScore />
  </FlexCM>
)))
