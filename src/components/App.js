import React from 'react'
import { inject, observer } from 'mobx-react'

import Outer from './pages/Outer'
import Router from './Router'

import '../styles/components/App.css'
import Error from './Error'

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
        <Error />
        <Router page={server.currentPage} />
      </Outer>
    )
  }
}

export default inject('server')(observer(App))
