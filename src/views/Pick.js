import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'

const Questions = styled(FlexCM)`
  div {
    width: 80%;
  }
`

const B = styled(Button)`
  background: #eee8d5;
  color: #268bd2;
  font-size: 16px;
  height: auto;
  padding: 15px;
  width: 100%;
`

const Question = inject('server')(({ question, server }) => (
  <div><B onClick={() => server.chooseQuestion(question)}>{question}</B></div>
))

export default inject('server')(observer(({ server }) => (
  <FlexCM>
    <Title>Pick a question</Title>
    <div>This is your turn to pick a question for others to answer!</div>
    <div />
    <Questions>
      {(server.data.choices || []).map((q, i) => <Question key={i} question={q} />)}
    </Questions>
  </FlexCM>
)))
