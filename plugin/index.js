import Bluetooth from './utils/bluetooth'

module.exports = {
  sayHello() {
    console.debug('Hello plugin!')
  },
  Bluetooth: Bluetooth
}
