import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button, ButtonOulineRM } from '../components/styles/Form'
import { Centered, Title } from '../components/styles/Texts'
import { FlexCM, FlexH } from '../components/styles/Flex'

const Answer = styled.span`
  color: #dc322f;
  font-size: large;
  font-weight: bolder;
`
const Question = styled(Centered)`
  padding: 10px;
`

const FilledQuestion = ({ question, answers }) => {
  let filledQuestion = question
  if (question.split('_').length === 1) {
    filledQuestion += ' _'
  }
  const parts = filledQuestion.split('_')
  console.log(filledQuestion, parts)
  const fixedAnswers = answers.map(a => a[a.length - 1] === '.' ? a.slice(0, -1) : a)

  return <Question>{parts.map((p, i) => <span key={i}>{p}{i !== parts.length - 1 ? fixedAnswers[i] ? <Answer>{fixedAnswers[i]}</Answer> : '_' : null}</span>)}</Question>
}

export default inject('server')(observer(({ server }) => {
  const m = server.numberOfAnswers > 1
  return (
    <FlexCM>
      <Title>Pick Answer(s)</Title>
      <div>{`Please choose ${m ? 'cards' : 'a card'} to fill the blank${m ? 's' : ''}!`}</div>
      <FilledQuestion question={server.question} answers={server.answers} />
      <FlexH>
        <ButtonOulineRM onClick={() => server.resetAnswers()}>Reset</ButtonOulineRM>
        <Button disabled={server.answers.length !== server.numberOfAnswers} onClick={() => server.chooseAnswers()}>Confirm</Button>
      </FlexH>
    </FlexCM>
  )
}))
