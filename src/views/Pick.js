import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button, QuestionButton } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'

const Questions = styled(FlexCM)`
  div {
    width: 80%;
  }
`

const Question = inject('server')(({ onClick, question, selected, server }) => (
  <QuestionButton
    className={selected ? 'selected' : ''}
    dangerouslySetInnerHTML={{ __html: question }}
    onClick={onClick}
  />
))

export default inject('server')(observer(({ server }) => {
  const [selected, setSelected] = useState([])
  const handlingClick = u => {
    const s = selected.slice(0, selected.length)
    if (s.indexOf(u) !== -1) {
      s.splice(s.indexOf(u), 1)
    } else {
      s.push(u)
    }
    setSelected(s)
  }

  return (
    <FlexCM>
      <Title>Pick a question</Title>
      <div>This is your turn to pick a question for others to answer!</div>
      <div />
      <Questions>
        {server.choices.map((q, i) => <Question key={i} question={q} onClick={() => handlingClick(q)} selected={selected.indexOf(q) !== -1} />)}
      </Questions>
      <Button onClick={() => server.chooseQuestion(selected[0])} disabled={selected.length !== 1}>Confirm</Button>
    </FlexCM>
  )
}))
