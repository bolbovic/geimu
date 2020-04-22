import React from 'react'
import { inject, observer } from 'mobx-react'
import { orderBy } from 'lodash'

import User from './User'

export default inject('server')(observer(({ showScore, showPicked, showReady, server }) => {
  const u = showScore ? orderBy(server.users, ['score'], ['desc']) : server.users
  return (
    <div style={{ width: '80%' }}>
      {(u || []).map((u, i) => (
        <User
          key={i}
          showPicked={showPicked}
          showScore={showScore}
          showReady={showReady}
          user={u}
        />
      ))}
    </div>
  )
}))
