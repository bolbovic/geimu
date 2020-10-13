import React from 'react'
import { inject, observer } from 'mobx-react'

import Error from './Error'
import Info from './Info'
import Hand from './Hand'
import Modals from './Modals'
import Outer from './pages/Outer'
import Menu from './Menu'
import Router from './Router'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4001'
    }
  }

  render () {
    const { server } = this.props
    return (
      <Outer>
        <Menu />
        <Router page={server.currentPage} />
        <Hand />
        <Info />
        <Error />
        <Modals />
      </Outer>
    )
  }
}

export default inject('server')(observer(App))
