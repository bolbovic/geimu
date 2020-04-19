import React from 'react'

import Login from '../views/Login'
import Lobby from '../views/Lobby'
import Pick from '../views/Pick'
import PickAnswer from '../views/PickAnswer'
import Scoreboard from '../views/Scoreboard'
import Waiting from '../views/Waiting'

export default ({ page }) => {
  console.log('router', page)
  switch (page) {
    case 'lobby':
      return <Lobby />
    case 'scoreboard':
      return <Scoreboard />
    case 'pick-question':
      return <Pick />
    case 'waiting-answers':
      return <Waiting />
    case 'pick-answer':
      return <PickAnswer />
    case 'login':
    default:
      return <Login />
  }
}
