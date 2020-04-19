import React from 'react'
import { inject, observer } from 'mobx-react'

import Hand from '../components/Hand'

export default inject('server')(observer(({ server }) => (
  <div>
    <div>Waiting for players</div>
    <div>
      {(server.data.users || []).map((u, i) => <div key={i}>{u.name} - {(server.data.picker && server.data.picker.name === u.name) || u.picked ? 'OK' : 'Waiting...'}</div>)}
    </div>
    <Hand />
  </div>
)))
