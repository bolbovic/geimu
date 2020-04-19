import React from 'react'
import { inject, observer } from 'mobx-react'

const Score = ({ user }) => (
  <div style={{ color: user.ready ? 'blue' : 'black' }}>
    {user.name} - {user.score}
  </div>
)

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Results</div>
    <div>{`${server.data.picker ? server.data.picker.name : ''} choose ${server.data.winner ? server.data.winner.picked : ''}.`}</div>
    <div>{`Congrats ${server.data.winner ? server.data.winner.name : ''}!!!`}</div>
    <button disabled={server.isReady} onClick={() => server.ready()}>Ready</button>
    <div>Scoreboard</div>
    <div>
      {(server.data.users || []).map((u, i) => <Score key={i} user={u} />)}
    </div>
  </div>
)))
