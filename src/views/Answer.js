import React from 'react'
import { inject, observer } from 'mobx-react'
import { shuffle } from 'lodash'

const Answer = inject('server')(({ answers, server, user }) => (
  <div>
    {(answers || []).join(', ')}
    {server.isPicker ? <button onClick={() => server.pickAnswer(user)}>Choose</button> : null}
  </div>
))

export default inject('server')(observer(({ server }) => (
  <div>
    <div>{server.isPicker ? 'Pick Answer for your question' : 'Waiting for the picker to choose...'}</div>
    <div>{server.data.question}</div>
    <div>
      {(shuffle(server.data.users) || []).map((u, i) => u.picked ? <Answer key={i} answers={u.picked} user={u} /> : null)}
    </div>
  </div>
)))
