import React from 'react'
import { inject, observer } from 'mobx-react'

const Question = inject('server')(({ question, server }) => (
  <div onClick={() => server.chooseQuestion(question)}>{question}</div>
))

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Pick</div>
    <div>
      {(server.data.choices || []).map((q, i) => <Question key={i} question={q} />)}
    </div>
  </div>
)))
