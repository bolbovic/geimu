import React from 'react'

import Login from '../views/Login'
import Lobby from '../views/Lobby'

export default ({ page }) => {
  console.log('router', page)
  switch (page) {
    case 'lobby':
      return <Lobby />
    case 'login':
    default:
      return <Login />
  }
}
