//Pri implementácii socket.io sme sa inšpirovali článkom https://medium.com/@armyabakouan/how-to-configure-socket-io-for-adonisjs-v6-4afbcaa1a465
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

class Ws {
  public io: Server | undefined
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })
  }
}

export default new Ws()
