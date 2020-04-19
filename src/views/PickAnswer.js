import React from 'react'
import { inject, observer } from 'mobx-react'

const Answer = inject('server')(({ answer, server }) => (
  <div onClick={() => server.chooseAnswer(answer)}>{answer}</div>
))

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Pick Answer for this question</div>
    <div>{server.data.question}</div>
    <div>
      {(server.data.hand || []).map((a, i) => <Answer key={i} answer={a} />)}
    </div>
  </div>
)))
