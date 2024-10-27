import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ChatRoom from '#models/chat_room'

export default class ChatRoomInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inviterId: number

  @column()
  declare chatRoomId: number

  @column()
  declare userId: number

  @column()
  declare accepted: boolean | null

  @belongsTo(() => User, {
    foreignKey: 'inviterId',
  })
  declare inviter: BelongsTo<typeof User>

  @belongsTo(() => ChatRoom, {
    foreignKey: 'chatRoomId',
  })
  declare chatRoom: BelongsTo<typeof ChatRoom>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async getJson() {
    return {
      id: this.id,
      name: this.chatRoom.name,
      private: this.chatRoom.private,
      from: this.inviter.nickname,
    }
  }
}
