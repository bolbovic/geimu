import React from 'react'
import socketIOClient from 'socket.io-client'
import { inject, observer } from 'mobx-react'

import Outer from './pages/Outer'
import Router from './Router'

import '../styles/components/App.css'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4001'
    }
  }

  componentDidMount () {
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.on('FromAPI', data => this.setState({ response: data }))
  }

  render () {
    const { server } = this.props
    return (
      <Outer>
        <Router page={server.currentPage} />
      </Outer>
    )
  }
}

export default inject('server')(observer(App))
