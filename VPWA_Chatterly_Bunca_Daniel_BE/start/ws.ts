import Ws from '#services/ws'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'

app.ready(() => {
  Ws.boot()

  Ws.io?.on('connection', (socket) => {
    socket.on('authenticate', async (data) => {
      const accessToken = await User.accessTokens.verify(new Secret(data.accessToken))
      if (accessToken === null) {
        return
      }

      const user = await User.find(accessToken.tokenableId)
      if (user === null) {
        return
      }
      socket.join(user.nickname)
    })
  })
})
