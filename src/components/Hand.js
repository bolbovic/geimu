import React from 'react'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Your hand</div>
    <div>
      {(server.hand || []).map((h, i) => <div key={i}>{h}</div>)}
    </div>
  </div>
)))
