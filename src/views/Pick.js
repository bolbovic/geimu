import React from 'react'
import { inject, observer } from 'mobx-react'

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Pick</div>
    <div>
      {(server.data.questions || []).map((q, i) => <div key={i}>{q}</div>)}
    </div>
  </div>
)))
