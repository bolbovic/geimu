import React from 'react'

import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import Users from '../components/Users'

export default () => (
  <FlexCM>
    <Title>Waiting for players</Title>
    <Users showPicked />
  </FlexCM>
)
