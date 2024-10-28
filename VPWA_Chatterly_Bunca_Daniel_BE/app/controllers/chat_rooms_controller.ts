import { HttpContext } from '@adonisjs/core/http'
import ChatRoomService from '#services/chat_room_service'
import { createChatRoomValidator, invitationResponseValidator } from '#validators/chat_room'
import { inject } from '@adonisjs/core'

@inject()
export default class ChatRoomsController {
  constructor(private chatRoomService: ChatRoomService) {}

  async create(context: HttpContext) {
    const payload = await context.request.validateUsing(createChatRoomValidator)
    const user = context.auth.getUserOrFail()
    const chatRoom = await this.chatRoomService.createChatRoom(user, payload)
    return context.response.json(await chatRoom.getJson(user))
  }

  async invite(context: HttpContext) {
    const inviter = context.auth.getUserOrFail()
    const chatId: number = context.request.param('chatId')
    const invitedUserId: number = context.request.param('invitedUserId')
    await this.chatRoomService.inviteUser(inviter, chatId, invitedUserId)
    return context.response.json(null)
  }

  async getInvitations(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getChatRoomInvitationsJson())
  }

  async invitationResponse(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const payload = await context.request.validateUsing(invitationResponseValidator)
    const invitationId: number = context.request.param('invitationId')
    await this.chatRoomService.responseToInvitation(user, invitationId, payload)
    return context.response.json(null)
  }

  async join(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const chatRoomName: string = decodeURIComponent(context.request.param('chatRoomName'))
    await this.chatRoomService.joinChatRoom(user, chatRoomName)
    return context.response.json(null)
  }

  async getChatRooms(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getChatRoomsJson())
  }
}
