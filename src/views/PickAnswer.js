import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'

const Answer = ({ answer, idx, onClick, server }) => (
  <button onClick={() => onClick(answer)} disabled={idx !== -1}>{`${idx !== -1 ? `[${idx + 1}] ` : ''}${answer}`}</button>
)

export default inject('server')(observer(({ server }) => {
  const [answers, setAnswers] = useState([])
  const addAnswer = a => { setAnswers(answers.concat([a])) }
  return (
    <div>
      <div>Pick Answer(s) for this question</div>
      <div>{server.data.question}</div>
      <div>
        {(server.data.hand || []).map((a, i) => <Answer key={i} answer={a} idx={answers.indexOf(a)} onClick={a => addAnswer(a)} />)}
      </div>
      <button disabled={answers.length !== server.numberOfAnswers} onClick={() => server.chooseAnswer(answers)}>Confirm</button>
      <button onClick={() => setAnswers([])}>Reset</button>
    </div>
  )
}))
