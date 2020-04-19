import React from 'react'
import { inject, observer } from 'mobx-react'

const Answer = inject('server')(({ answer, server, user }) => (
  <div>
    {answer}
    {server.isPicker ? <button onClick={() => server.pickAnswer(user)}>Choose</button> : null}
  </div>
))

export default inject('server')(observer(({ server }) => (
  <div>
    <div>{server.isPicker ? 'Pick Answer for your question' : 'Waiting for the picker to choose...'}</div>
    <div>{server.data.question}</div>
    <div>
      {(server.data.users || []).map((u, i) => u.picked ? <Answer key={i} answer={u.picked} user={u} /> : null)}
    </div>
  </div>
)))
