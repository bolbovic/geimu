import { decorate, observable } from 'mobx'

class Modals {
  cardToSwitch: string | null
  userToKick: string | null
  quit: boolean

  constructor () {
    this.cardToSwitch = null
    this.quit = false
    this.userToKick = null
  }

  showKick (u:any) { this.userToKick = u }
  hideKick () { this.userToKick = null }

  showSwitch (c:string) { this.cardToSwitch = c }
  hideSwitch () { this.cardToSwitch = null }

  showQuit () { this.quit = true }
  hideQuit () { this.quit = false }
}

decorate(Modals, {
  cardToSwitch: observable,
  quit: observable,
  userToKick: observable
})

export default Modals