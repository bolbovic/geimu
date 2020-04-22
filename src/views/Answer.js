import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Button } from '../components/styles/Form'
import { FlexCM } from '../components/styles/Flex'
import { Title } from '../components/styles/Texts'
import FilledQuestion from '../components/FilledQuestion'

const B = styled.div`
  background: #eee8d5;
  border-radius: 10px;
  border: 4px solid #eee8d5;
  box-sizing: border-box;
  color: #268bd2;
  height: auto;
  width: 100%;
  &.selected {
    border-color: #d33682;
  }
`

const Questions = styled(FlexCM)`
  > div {
    width: 80%;
  }
`

const Answer = inject('server')(({ answers, onClick, question, selected, user }) => (
  <div>
    <B onClick={onClick} className={selected ? 'selected' : ''}>
      <FilledQuestion question={question} answers={answers} />
    </B>
  </div>
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
        {server.shuffledUsers.map((u, i) => u.picked ? (
          <Answer
            key={i}
            answers={u.picked}
            onClick={() => handlingClick(u)}
            question={server.question}
            selected={selected.indexOf(u) !== -1}
            user={u}
          />
        ) : null)}
      </Questions>
      <Button onClick={() => server.pickAnswer(selected[0])} disabled={selected.length !== 1}>Confirm</Button>
    </FlexCM>
  )
}))
