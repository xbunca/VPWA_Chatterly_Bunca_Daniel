import ChatRoom from '#models/chat_room'
import User from '#models/user'
import ChatRoomInvitation from '#models/chat_room_invitation'
import ChatRoomMembership from '#models/chat_room_membership'
import { HttpException } from '#exceptions/http_exception'

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

    await ChatRoomInvitation.create({
      inviterId: inviter.id,
      chatRoomId: chatRoom.id,
      userId: invitedUser.id,
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
}
