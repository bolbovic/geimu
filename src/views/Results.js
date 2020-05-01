import React from 'react'
import { inject, observer } from 'mobx-react'

import { Button } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import FilledQuestion from '../components/FilledQuestion'
import Users from '../components/Users'
import { UserText } from '../components/User'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Results</Title>
    <div><UserText>{server.picker.name}</UserText> chose...</div>
    <FilledQuestion question={server.question} answers={server.winner.picked || []} />
    <Title>Congrats <UserText>{server.winner.name}</UserText>!!!</Title>
    <Users showScore showReady showWinner />
    <Button disabled={server.isReady} onClick={() => server.ready()}>Ready</Button>
  </FlexCM>
)))
