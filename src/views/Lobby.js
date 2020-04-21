import React from 'react'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Lobby</div>
    <div>{server.data.name}</div>
    <div>
      {(server.data.users || []).map((u, i) => <div key={i}>{u.name}</div>)}
    </div>
    {server.isMaster && server.data.users && server.data.users.length > 2 ? <button onClick={() => server.launchGame()}>Launch</button> : null}
  </div>
)))
