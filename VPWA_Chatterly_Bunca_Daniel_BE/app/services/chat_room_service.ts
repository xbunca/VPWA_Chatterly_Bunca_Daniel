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
    const chatRoomUserIds: number[] = []
    for (const chatRoomMembership of chatRoom.chatRoomMemberships) {
      chatRoomUserIds.push(chatRoomMembership.userId)
    }

    if (chatRoomUserIds.includes(invitedUser.id)) {
      // TODO: throw exception
      return
    }

    await invitedUser.load('chatRoomInvitations')
    const invitedUserChatRoomInvitationIds: number[] = []
    for (const invitedUserChatRoomInvitation of invitedUser.chatRoomInvitations) {
      invitedUserChatRoomInvitationIds.push(invitedUserChatRoomInvitation.chatRoomId)
    }

    if (invitedUserChatRoomInvitationIds.includes(chatRoom.id)) {
      // TODO: throw exception
      return
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
}
