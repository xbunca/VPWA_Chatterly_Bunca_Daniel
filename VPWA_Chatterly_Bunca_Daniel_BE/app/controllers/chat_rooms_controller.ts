import { HttpContext } from '@adonisjs/core/http'
import ChatRoomService from '#services/chat_room_service'
import { createChatRoomValidator } from '#validators/chat_room'
import { inject } from '@adonisjs/core'

@inject()
export default class ChatRoomsController {
  constructor(private chatRoomService: ChatRoomService) {}

  async create(context: HttpContext) {
    const payload = await context.request.validateUsing(createChatRoomValidator)
    const user = context.auth.getUserOrFail()
    const chatRoom = await this.chatRoomService.createChatRoom(user, payload)
    return context.response.json(await chatRoom.getJson())
  }

  async getChatRooms(context: HttpContext) {
    const user = context.auth.getUserOrFail()
    return context.response.json(await user.getChatRoomsJson())
  }
}
