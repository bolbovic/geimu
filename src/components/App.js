import React from 'react'
import { inject, observer } from 'mobx-react'

import Outer from './pages/Outer'
import Router from './Router'

import '../styles/components/App.css'

const Error = inject('server')(observer(({ server }) => server.error ? (
  <div className='error'>{server.error}</div>
) : null))

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
