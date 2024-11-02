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
    const chatId: number = Number(context.request.param('chatId'))
    const invitedUserNickname: string = decodeURIComponent(
      context.request.param('invitedUserNickname')
    )
    await this.chatRoomService.inviteUser(inviter, chatId, invitedUserNickname)
    return context.response.json({})
  }

  async getInvitations(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getChatRoomInvitationsJson())
  }

  async invitationResponse(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const payload = await context.request.validateUsing(invitationResponseValidator)
    const invitationId: number = Number(context.request.param('invitationId'))
    const chatRoom = await this.chatRoomService.responseToInvitation(user, invitationId, payload)

    if (chatRoom !== null) {
      return context.response.json(await chatRoom.getJson(user))
    } else {
      return context.response.json({})
    }
  }

  async join(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const chatRoomName: string = decodeURIComponent(context.request.param('chatRoomName'))
    const chatRoom = await this.chatRoomService.joinChatRoom(user, chatRoomName)
    return context.response.json(await chatRoom.getJson(user))
  }

  async getChatRooms(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getChatRoomsJson())
  }

  async leave(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const chatRoomId: number = Number(context.request.param('chatRoomId'))
    await this.chatRoomService.leaveChatRoom(user, chatRoomId)
    return context.response.json({})
  }

  async detail(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const chatRoomId: number = Number(context.request.param('chatRoomId'))
    const chatRoom = await this.chatRoomService.getChatRoom(user, chatRoomId)
    return context.response.json(await chatRoom.getJsonDetail(user))
  }

  async getMessages(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    const chatRoomId: number = Number(context.request.param('chatRoomId'))
    const limit: number = Number(context.request.qs().limit)
    const lastMessageId: number | null = context.request.qs().lastMessageId
      ? Number(context.request.qs().lastMessageId)
      : null
    const messages = await this.chatRoomService.getMessages(user, chatRoomId, limit, lastMessageId)
    const messagesJson = []
    for (const message of messages) {
      messagesJson.push(await message.getJson(user))
    }
    return context.response.json(messagesJson)
  }
}
