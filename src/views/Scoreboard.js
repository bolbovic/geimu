import React from 'react'
import { inject, observer } from 'mobx-react'

import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import User from '../components/User'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Scoreboard</Title>
    <div>{`Waiting for ${server.picker.name} to pick a question.`}</div>
    <div style={{ width: '80%' }}>
      {(server.data.users || []).map((u, i) => <User key={i} user={u} showScore />)}
    </div>
  </FlexCM>
)))
