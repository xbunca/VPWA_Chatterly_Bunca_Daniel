import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ChatRoom from '#models/chat_room'

export default class ChatRoomKickVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'chat_room_id' })
  declare chatRoomId: number

  @column({ columnName: 'kicker_id' })
  declare kickerId: number

  @column({ columnName: 'user_id' })
  declare targetUserId: number

  @belongsTo(() => ChatRoom)
  declare chatRoom: BelongsTo<typeof ChatRoom>

  @belongsTo(() => User, { foreignKey: 'kickerId' })
  declare kicker: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'targetUserId' })
  declare targetUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
