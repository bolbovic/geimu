import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import * as serviceWorker from './tools/serviceWorker'

import App from './components/App'
import Modals from './mobx/Modals'
import Server from './mobx/Server'

import './styles/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle, faSpinner, faTimes, faUserSlash } from '@fortawesome/free-solid-svg-icons'
library.add(faCheckCircle, faSpinner, faTimes, faUserSlash)

const modals = new Modals()
const server = new Server()

const stores = {
  modals,
  server
}

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
