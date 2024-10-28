import ChatRoom from '#models/chat_room'
import User from '#models/user'
import ChatRoomInvitation from '#models/chat_room_invitation'
import ChatRoomMembership from '#models/chat_room_membership'

export default class ChatRoomService {
  async createChatRoom(user: User, payload: any): Promise<ChatRoom> {
    return await ChatRoom.create({
      name: payload.name,
      private: payload.private,
      ownerId: user.id,
    })
  }

  async inviteUser(inviter: User, chatRoomId: number, invitedUserId: number) {
    const chatRoom = await ChatRoom.findOrFail(chatRoomId)
    const invitedUser = await User.findOrFail(invitedUserId)

    if (inviter.id === invitedUser.id) {
      // TODO: throw exception
      return
    }

    await chatRoom.load('owner')

    if (chatRoom.private && chatRoom.owner.id !== inviter.id) {
      // TODO: throw exception
      return
    }

    if (invitedUser.id === chatRoom.owner.id) {
      // TODO: throw exception
      return
    }

    await chatRoom.load('chatRoomMemberships')
    for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
      if (chatRoomMembership.userId === invitedUser.id) {
        // TODO: throw exception
        return
      }
    }

    await invitedUser.load('chatRoomInvitations')
    for (const invitedUserChatRoomInvitation of invitedUser.chatRoomInvitations) {
      if (invitedUserChatRoomInvitation.chatRoomId === chatRoom.id) {
        // TODO: throw exception
        return
      }
    }

    await ChatRoomInvitation.create({
      inviterId: inviter.id,
      chatRoomId: chatRoom.id,
      userId: invitedUser.id,
    })
  }

  async responseToInvitation(user: User, invitationId: number, payload: any) {
    const invitation = await ChatRoomInvitation.findOrFail(invitationId)

    if (invitation.userId !== user.id) {
      // TODO: throw exception
      return
    }

    if (invitation.accepted !== null) {
      // TODO: throw exception
      return
    }

    const accept = payload.accept
    invitation.accepted = accept
    await invitation.save()

    if (accept) {
      await ChatRoomMembership.create({
        userId: user.id,
        chatRoomId: invitation.chatRoomId,
        inviteId: invitation.id,
      })
    }
  }

  async joinChatRoom(user: User, chatRoomName: string) {
    const chatRoom = await ChatRoom.findByOrFail('name', chatRoomName)

    if (chatRoom.ownerId === user.id) {
      // TODO: throw exception
      return
    }

    if (chatRoom.private) {
      // TODO: throw exception
      return
    }

    await user.load('chatRoomInvitations')
    for (const chatRoomInvitation of user.chatRoomInvitations) {
      if (chatRoomInvitation.chatRoomId === chatRoom.id) {
        const payload = {
          accept: true,
        }
        await this.responseToInvitation(user, chatRoomInvitation.id, payload)
        return
      }
    }

    await user.load('chatRoomMemberships')
    for (const chatRoomMembership of user.chatRoomMemberships) {
      if (chatRoomMembership.chatRoomId === chatRoom.id) {
        // TODO: throw exception
        return
      }
    }

    await ChatRoomMembership.create({
      userId: user.id,
      chatRoomId: chatRoom.id,
    })
  }

  async leaveChatRoom(user: User, chatRoomId: number) {
    const chatRoom = await ChatRoom.findOrFail(chatRoomId)

    if (chatRoom.ownerId === user.id) {
      await chatRoom.delete()
      return
    }

    const chatRoomMembership = await ChatRoomMembership.findByOrFail({
      userId: user.id,
      chatRoomId: chatRoomId,
    })

    await chatRoomMembership.delete()
  }
}
