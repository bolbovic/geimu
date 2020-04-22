import React from 'react'
import { inject, observer } from 'mobx-react'

import User from './User'

export default inject('server')(observer(({ showScore, showPicked, showReady, server }) => (
  <div style={{ width: '80%' }}>
    {(server.data.users || []).map((u, i) => (
      <User
        key={i}
        showPicked={showPicked}
        showScore={showScore}
        showReady={showReady}
        user={u}
      />
    ))}
  </div>
)))
