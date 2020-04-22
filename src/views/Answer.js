import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button, QuestionButton } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import FilledQuestion from '../components/FilledQuestion'

const Questions = styled(FlexCM)`
  overflow-y: auto;
  > div {
    width: 80%;
  }
`

const Answer = inject('server')(({ answers, onClick, question, selected, user }) => (
  <QuestionButton onClick={onClick} className={selected ? 'selected' : ''}>
    <FilledQuestion question={question} answers={answers} />
  </QuestionButton>
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
      <Title>Selecting</Title>
      <div>{server.isPicker ? 'Pick an answer for your question' : 'Waiting for the picker to choose an answer...'}</div>
      <div>{server.data.question}</div>
      <Questions>
        {server.shuffledUsers.map((u, i) => Array.isArray(u.picked) ? (
          <Answer
            key={i}
            answers={u.picked || []}
            onClick={server.isPicker ? () => handlingClick(u) : null}
            question={server.question}
            selected={selected.indexOf(u) !== -1}
            user={u}
          />
        ) : null)}
      </Questions>
      {server.isPicker ? <Button onClick={() => server.pickAnswer(selected[0])} disabled={selected.length !== 1}>Confirm</Button> : null}
    </FlexCM>
  )
}))
