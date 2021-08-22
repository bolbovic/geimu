import React from 'react'
import { inject, observer } from 'mobx-react'

import Error from './Error'
import Info from './Info'
import Hand from './Hand'
import Modals from './Modals'
import Outer from './pages/Outer'
import Menu from './Menu'
import Router from './Router'

@observer
@inject('server')
class App extends React.Component {
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
export default App
