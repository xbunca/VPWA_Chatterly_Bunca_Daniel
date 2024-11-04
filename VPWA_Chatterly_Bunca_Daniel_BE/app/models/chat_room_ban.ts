import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ChatRoom from '#models/chat_room'

export default class ChatRoomBan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'chat_room_id' })
  declare chatRoomId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => ChatRoom)
  declare chatRoom: BelongsTo<typeof ChatRoom>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
