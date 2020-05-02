import { extendObservable } from 'mobx'

export default class Server {
  constructor () {
    extendObservable(this, {
      cardToSwitch: null,
      quit: false,
      userToKick: null
    })
  }

  showKick (u) { this.userToKick = u }
  hideKick () { this.userToKick = null }

  showSwitch (c) { this.cardToSwitch = c }
  hideSwitch () { this.cardToSwitch = null }

  showQuit () { this.quit = true }
  hideQuit () { this.quit = false }
}
