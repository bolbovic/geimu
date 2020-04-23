import { extendObservable } from 'mobx'

export default class Server {
  constructor () {
    extendObservable(this, {
      quit: false,
      userToKick: null
    })
  }

  showKick (u) { this.userToKick = u }
  hideKick () { this.userToKick = null }

  showQuit () { this.quit = true }
  hideQuit () { this.quit = false }
}
