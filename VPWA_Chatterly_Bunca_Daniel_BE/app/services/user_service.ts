import User from '#models/user'
import State from '#models/state'
import { HttpException } from '#exceptions/http_exception'
import Ws from '#services/ws'

export default class UserService {
  async createNewUser(payload: any): Promise<User> {
    return await User.create({
      name: payload.name,
      surname: payload.surname,
      nickname: payload.nickname,
      emailAddress: payload.email,
      password: payload.password,
    })
  }

  async updateUser(user: User, payload: any): Promise<User> {
    try {
      if (
        payload.stateId !== undefined &&
        payload.stateId !== null &&
        (await State.findOrFail(payload.stateId)) &&
        user.stateId !== payload.stateId
      ) {
        user.stateId = payload.stateId

        await user.load('ownedChatRooms')
        for (const ownedChatRoom of user.ownedChatRooms) {
          const userStateChangedBody = {
            userNickname: user.nickname,
            chatRoomId: ownedChatRoom.id,
            stateId: payload.stateId,
          }

          Ws.io?.to(user.nickname).emit('userStateChanged', userStateChangedBody)

          await ownedChatRoom.load('chatRoomMemberships')
          for (const chatRoomMembership of ownedChatRoom.chatRoomMemberships) {
            await chatRoomMembership.load('user')
            Ws.io
              ?.to(chatRoomMembership.user.nickname)
              .emit('userStateChanged', userStateChangedBody)
          }
        }

        await user.load('chatRoomMemberships')
        for (const chatRoomMembership of user.chatRoomMemberships) {
          await chatRoomMembership.load('chatRoom')

          const userStateChangedBody = {
            userNickname: user.nickname,
            chatRoomId: chatRoomMembership.chatRoom.id,
            stateId: payload.stateId,
          }

          await chatRoomMembership.chatRoom.load('owner')

          Ws.io
            ?.to(chatRoomMembership.chatRoom.owner.nickname)
            .emit('userStateChanged', userStateChangedBody)

          await chatRoomMembership.chatRoom.load('chatRoomMemberships')
          for (const otherUserChatRoomMembership of chatRoomMembership.chatRoom
            .chatRoomMemberships) {
            await otherUserChatRoomMembership.load('user')
            Ws.io
              ?.to(otherUserChatRoomMembership.user.nickname)
              .emit('userStateChanged', userStateChangedBody)
          }
        }
      }
    } catch (e) {
      throw new HttpException(404, 'State not found')
    }

    if (
      payload.notifyMentionsOnly !== undefined &&
      payload.notifyMentionsOnly !== null &&
      payload.notifyMentionsOnly !== user.notifyMentionsOnly
    ) {
      user.notifyMentionsOnly = payload.notifyMentionsOnly
    }

    return user.save()
  }
}
