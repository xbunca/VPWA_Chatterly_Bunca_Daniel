import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ChatRoom from '#models/chat_room'
import ChatRoomInvitation from '#models/chat_room_invitation'

export default class ChatRoomMembership extends BaseModel {
  public static table = 'chat_room_members'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare chatRoomId: number

  @column()
  declare inviteId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ChatRoom, {
    foreignKey: 'chatRoomId',
  })
  declare chatRoom: BelongsTo<typeof ChatRoom>

  @belongsTo(() => ChatRoomInvitation, {
    foreignKey: 'inviteId',
  })
  declare invitation: BelongsTo<typeof ChatRoomInvitation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
