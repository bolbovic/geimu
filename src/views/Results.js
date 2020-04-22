import React from 'react'
import { inject, observer } from 'mobx-react'

import { Button } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import FilledQuestion from '../components/FilledQuestion'
import Users from '../components/Users'

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Results</Title>
    <div>{`${server.picker.name || ''} chose...`}</div>
    <FilledQuestion question={server.question} answers={server.winner.picked || []} />
    <Title>{`Congrats ${server.winner.name || ''}!!!`}</Title>
    <Users showScore showReady />
    <Button disabled={server.isReady} onClick={() => server.ready()}>Ready</Button>
  </FlexCM>
)))
