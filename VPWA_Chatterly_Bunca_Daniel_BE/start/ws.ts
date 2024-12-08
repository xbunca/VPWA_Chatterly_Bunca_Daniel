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

    socket.on('typing', async (data) => {
      const user = await authenticate(data.accessToken)
      if (!user) return

      try {
        await chatRomService.broadcastTyping(data.chatRoomId, user)
      } catch (error) {
        console.error('Error broadcasting typing event:', error)
      }
    })

    socket.on('draftMessage', async (data) => {
      const user = await authenticate(data.accessToken)
      if (!user) return

      try {
        await chatRomService.broadcastDraftMessage(data.chatRoomId, user, data.content)
      } catch (error) {
        console.error('Error broadcasting draft message event:', error)
      }
    })

    socket.on('newMessage', async (data) => {
      const user = await authenticate(data.accessToken)
      if (user === null) {
        return
      }

      let chatRoom: ChatRoom | null = null

      try {
        chatRoom = await chatRomService.getChatRoom(user, data.chatRoomId)
      } catch (error) {}

      if (chatRoom === null) {
        return
      }

      await chatRomService.createMessage(user, data.content, data.chatRoomId, chatRoom)
      await chatRomService.handleUserSentMessage(data.chatRoomId, user)
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
