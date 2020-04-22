import React from 'react'
import styled from 'styled-components'

import { Centered } from '../components/styles/Texts'

const Answer = styled.span`
color: #dc322f;
font-size: large;
font-weight: bolder;
`
const Question = styled(Centered)`
padding: 10px;
`

export default ({ question, answers }) => {
  let filledQuestion = question
  if (question.split('_').length === 1) {
    filledQuestion += ' _'
  }
  const parts = filledQuestion.split('_')
  const fixedAnswers = answers.map(a => a[a.length - 1] === '.' ? a.slice(0, -1) : a)

  return <Question>{parts.map((p, i) => <span key={i}>{p}{i !== parts.length - 1 ? fixedAnswers[i] ? <Answer>{fixedAnswers[i]}</Answer> : '_' : null}</span>)}</Question>
}
