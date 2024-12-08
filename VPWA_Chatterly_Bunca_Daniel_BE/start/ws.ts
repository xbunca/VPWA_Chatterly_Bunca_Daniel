import Ws from '#services/ws'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import ChatRoom from '#models/chat_room'
import ChatRoomService from '#services/chat_room_service'
import Subscription from '#models/subscription'
import webPush from 'web-push'
import Env from '#start/env'

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  Env.get('VAPID_PUBLIC_KEY'),
  Env.get('VAPID_PRIVATE_KEY')
)

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

    socket.on('subscribe', async (data) => {
      const user = socket.data.user
      if (!user) {
        return
      }

      try {
        const subscription = await Subscription.create({
          id: user.id,
          subscription: JSON.stringify(data.subscription),
        })
        console.log(`Subscription saved for user ${user.nickname}`)
      } catch (error) {
        console.error('Error saving subscription:', error)
      }
    })

    socket.on('unsubscribe', async (data) => {
      const user = socket.data.user
      if (!user) {
        return
      }

      try {
        await Subscription.query()
          .where('user_id', user.id)
          .andWhere('subscription', JSON.stringify(data.subscription))
          .delete()
        console.log(`Subscription removed for user ${user.nickname}`)
      } catch (error) {
        console.error('Error removing subscription:', error)
      }
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

      const subscriptions = await Subscription.query()
        .whereIn(
          'user_id',
          chatRoom.chatRoomMemberships.map((membership) => membership.userId)
        )
        .whereNot('user_id', user.id)

      for (const sub of subscriptions) {
        try {
          const subscription = JSON.parse(sub.subscription)
          const payload = JSON.stringify({
            title: `Message from ${user.nickname}`,
            body: data.content.slice(0, 100),
            chatRoomId: data.chatRoomId,
          })
          await webPush.sendNotification(subscription, payload)
        } catch (error) {
          console.error('Error sending push notification:', error)
        }
      }
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
