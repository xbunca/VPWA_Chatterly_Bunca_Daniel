import Ws from '#services/ws'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import ChatRoom from '#models/chat_room'
import ChatRoomService from '#services/chat_room_service'

const chatRomService = new ChatRoomService()

app.ready(() => {
  Ws.boot()

  Ws.io?.on('connection', (socket) => {
    socket.on('authenticate', async (data) => {
      const user = await authenticate(data.accessToken)
      if (user === null) {
        return
      }
      socket.join(user.nickname)
    })

    socket.on('newMessage', async (data) => {
      const user = await authenticate(data.accessToken)
      if (user === null) {
        return
      }

      const chatRoom = await ChatRoom.find(data.chatRoomId)
      if (chatRoom === null) {
        return
      }

      await chatRomService.createMessage(user, data.content, data.chatRoomId, chatRoom)
    })
  })
})

async function authenticate(token: string): Promise<User | null> {
  const accessToken = await User.accessTokens.verify(new Secret(token))
  if (accessToken === null) {
    return null
  }

  return await User.find(accessToken.tokenableId)
}
