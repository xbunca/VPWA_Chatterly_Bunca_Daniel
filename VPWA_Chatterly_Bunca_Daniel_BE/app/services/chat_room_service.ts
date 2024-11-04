import ChatRoom from '#models/chat_room'
import User from '#models/user'
import ChatRoomInvitation from '#models/chat_room_invitation'
import ChatRoomMembership from '#models/chat_room_membership'
import { HttpException } from '#exceptions/http_exception'
import Ws from '#services/ws'
import Message from '#models/message'

export default class ChatRoomService {
  async createChatRoom(user: User, payload: any): Promise<ChatRoom> {
    return await ChatRoom.create({
      name: payload.name,
      private: payload.private,
      ownerId: user.id,
    })
  }

  async inviteUser(inviter: User, chatRoomId: number, invitedUserNickname: string) {
    let chatRoom: ChatRoom

    try {
      chatRoom = await ChatRoom.findOrFail(chatRoomId)
    } catch (e) {
      throw new HttpException(404, 'Chat not found')
    }

    let invitedUser: User

    try {
      invitedUser = await User.findByOrFail('nickname', invitedUserNickname)
    } catch (e) {
      throw new HttpException(404, 'User does not exist')
    }

    if (inviter.id === invitedUser.id) {
      throw new HttpException(409, "You can't invite yourself")
    }

    await chatRoom.load('owner')

    if (chatRoom.private && chatRoom.owner.id !== inviter.id) {
      throw new HttpException(403, 'Only the room owner can invite users')
    }

    if (invitedUser.id === chatRoom.owner.id) {
      throw new HttpException(409, 'The user is already a member')
    }

    await chatRoom.load('chatRoomMemberships')
    for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
      if (chatRoomMembership.userId === invitedUser.id) {
        throw new HttpException(409, 'The user is already a member')
      }
    }

    await invitedUser.load('chatRoomInvitations')
    for (const invitedUserChatRoomInvitation of invitedUser.chatRoomInvitations) {
      if (invitedUserChatRoomInvitation.chatRoomId === chatRoom.id) {
        throw new HttpException(409, 'The user is already invited')
      }
    }

    const invitation = await ChatRoomInvitation.create({
      inviterId: inviter.id,
      chatRoomId: chatRoom.id,
      userId: invitedUser.id,
    })

    Ws.io?.to(invitedUser.nickname).emit('chatRoomInvitation', {
      id: invitation.id,
      name: chatRoom.name,
      private: chatRoom.private,
      from: inviter.nickname,
    })
  }

  async responseToInvitation(
    user: User,
    invitationId: number,
    payload: any
  ): Promise<ChatRoom | null> {
    let invitation: ChatRoomInvitation

    try {
      invitation = await ChatRoomInvitation.findOrFail(invitationId)
    } catch (e) {
      throw new HttpException(404, 'Invitation not found')
    }

    if (invitation.userId !== user.id) {
      throw new HttpException(403, "You can't respond to this invitation")
    }

    if (invitation.accepted !== null) {
      throw new HttpException(409, 'You responded to this invitation already')
    }

    const accept = payload.accept
    invitation.accepted = accept
    await invitation.save()

    if (accept) {
      const membership = await ChatRoomMembership.create({
        userId: user.id,
        chatRoomId: invitation.chatRoomId,
        inviteId: invitation.id,
      })
      await membership.load('chatRoom')

      await membership.chatRoom.load('owner')
      Ws.io?.to(membership.chatRoom.owner.nickname).emit('userJoinedChat', {
        chatRoomId: membership.chatRoomId,
        user: {
          name: user.name,
          surname: user.surname,
          nickname: user.nickname,
          stateId: user.stateId,
        },
      })

      await membership.chatRoom.load('chatRoomMemberships')
      for (const chatRoomMembership of membership.chatRoom.chatRoomMemberships) {
        if (chatRoomMembership.userId !== user.id) {
          await chatRoomMembership.load('user')
          Ws.io?.to(chatRoomMembership.user.nickname).emit('userJoinedChat', {
            chatRoomId: membership.chatRoomId,
            user: {
              name: user.name,
              surname: user.surname,
              nickname: user.nickname,
              stateId: user.stateId,
            },
          })
        }
      }

      return membership.chatRoom
    }

    return null
  }

  async joinChatRoom(user: User, chatRoomName: string): Promise<ChatRoom> {
    let chatRoom: ChatRoom

    try {
      chatRoom = await ChatRoom.findByOrFail('name', chatRoomName)
    } catch (e) {
      return await this.createChatRoom(user, {
        name: chatRoomName,
        private: false,
      })
    }

    if (chatRoom.ownerId === user.id) {
      throw new HttpException(409, 'You are a member already')
    }

    if (chatRoom.private) {
      throw new HttpException(403, "You can't join a private room")
    }

    await user.load('chatRoomInvitations')
    for (const chatRoomInvitation of user.chatRoomInvitations) {
      if (chatRoomInvitation.chatRoomId === chatRoom.id) {
        const payload = {
          accept: true,
        }
        await this.responseToInvitation(user, chatRoomInvitation.id, payload)
        return chatRoom
      }
    }

    await user.load('chatRoomMemberships')
    for (const chatRoomMembership of user.chatRoomMemberships) {
      if (chatRoomMembership.chatRoomId === chatRoom.id) {
        throw new HttpException(409, 'You are a member already')
      }
    }

    await ChatRoomMembership.create({
      userId: user.id,
      chatRoomId: chatRoom.id,
    })

    await chatRoom.load('owner')
    Ws.io?.to(chatRoom.owner.nickname).emit('userJoinedChat', {
      chatRoomId: chatRoom.id,
      user: {
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        stateId: user.stateId,
      },
    })

    await chatRoom.load('chatRoomMemberships')
    for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
      if (chatRoomMembership.userId !== user.id) {
        await chatRoomMembership.load('user')
        Ws.io?.to(chatRoomMembership.user.nickname).emit('userJoinedChat', {
          chatRoomId: chatRoom.id,
          user: {
            name: user.name,
            surname: user.surname,
            nickname: user.nickname,
            stateId: user.stateId,
          },
        })
      }
    }

    return chatRoom
  }

  async leaveChatRoom(user: User, chatRoomId: number) {
    let chatRoom: ChatRoom

    try {
      chatRoom = await ChatRoom.findOrFail(chatRoomId)
    } catch (e) {
      throw new HttpException(404, 'Chat not found')
    }

    if (chatRoom.ownerId === user.id) {
      await chatRoom.load('chatRoomMemberships')
      for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
        await chatRoomMembership.load('user')
        Ws.io?.to(chatRoomMembership.user.nickname).emit('chatRoomDeleted', {
          chatRoomId: chatRoom.id,
        })
      }

      await chatRoom.delete()
      return
    }

    let chatRoomMembership: ChatRoomMembership

    try {
      chatRoomMembership = await ChatRoomMembership.findByOrFail({
        userId: user.id,
        chatRoomId: chatRoomId,
      })
    } catch (e) {
      throw new HttpException(403, 'You are not a member of this chat')
    }

    await chatRoomMembership.delete()

    await chatRoom.load('owner')
    Ws.io?.to(chatRoom.owner.nickname).emit('userLeftChat', {
      chatRoomId: chatRoom.id,
      nickname: user.nickname,
    })

    await chatRoom.load('chatRoomMemberships')
    for (const chatMembership of chatRoom.chatRoomMemberships) {
      await chatMembership.load('user')
      Ws.io?.to(chatMembership.user.nickname).emit('userLeftChat', {
        chatRoomId: chatRoom.id,
        nickname: user.nickname,
      })
    }
  }

  async getChatRoom(user: User, chatRoomId: number): Promise<ChatRoom> {
    await user.load('ownedChatRooms')
    for (const chatRoom of user.ownedChatRooms) {
      if (chatRoom.id === chatRoomId) {
        return chatRoom
      }
    }

    await user.load('chatRoomMemberships')
    for (const chatRoomMembership of user.chatRoomMemberships) {
      if (chatRoomMembership.chatRoomId === chatRoomId) {
        await chatRoomMembership.load('chatRoom')
        return chatRoomMembership.chatRoom
      }
    }

    throw new HttpException(404, 'Chat not found')
  }

  async createMessage(
    user: User,
    content: string,
    chatRoomId: number,
    chatRoomInstance: ChatRoom | null = null
  ) {
    let chatRoom = chatRoomInstance

    if (chatRoom === null) {
      chatRoom = await this.getChatRoom(user, chatRoomId)
    }

    const message = await Message.create({
      content: content,
      senderId: user.id,
      chatRoomId: chatRoom.id,
    })

    await chatRoom.load('owner')
    const messageJson = await message.getJson(chatRoom.owner)
    Ws.io?.to(chatRoom.owner.nickname).emit('newMessage', {
      chatRoomId: chatRoom.id,
      notify: chatRoom.owner.canNotify(messageJson.isMine, messageJson.isMentioned),
      message: messageJson,
    })

    await chatRoom.load('chatRoomMemberships')
    for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
      await chatRoomMembership.load('user')
      const messageJson2 = await message.getJson(chatRoomMembership.user)
      Ws.io?.to(chatRoomMembership.user.nickname).emit('newMessage', {
        chatRoomId: chatRoom.id,
        notify: chatRoomMembership.user.canNotify(messageJson2.isMine, messageJson2.isMentioned),
        message: messageJson2,
      })
    }

    return message
  }

  async getMessages(user: User, chatRoomId: number, limit: number, lastMessageId: number | null) {
    let chatRoom = await this.getChatRoom(user, chatRoomId)

    const messages: Message[] = []
    let canAdd = lastMessageId === null
    await chatRoom.load('messages')
    const reversedMessages = chatRoom.messages.toReversed()
    for (const message of reversedMessages) {
      if (canAdd) {
        messages.push(message)
        limit--

        if (limit === 0) {
          break
        }
      }

      if (message.id === lastMessageId) {
        canAdd = true
      }
    }

    return messages.reverse()
  }
}
