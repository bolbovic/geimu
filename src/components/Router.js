import React from 'react'

import Login from '../views/Login'
import Lobby from '../views/Lobby'
import Pick from '../views/Pick'
import Scoreboard from '../views/Scoreboard'

export default ({ page }) => {
  console.log('router', page)
  switch (page) {
    case 'lobby':
      return <Lobby />
    case 'scoreboard':
      return <Scoreboard />
    case 'pick-question':
      return <Pick />
    case 'login':
    default:
      return <Login />
  }
}
