import React from 'react'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Scoreboard</div>
    <div>
      {(server.data.users || []).map((u, i) => <div key={i}>{u.name} - {u.score}</div>)}
    </div>
    <div>
      {(server.data.hand || []).map((h, i) => <div key={i}>{h}</div>)}
    </div>
  </div>
)))
