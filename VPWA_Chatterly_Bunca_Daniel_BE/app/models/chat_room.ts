import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ChatRoomMembership from '#models/chat_room_membership'

export default class ChatRoom extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare private: boolean

  @column()
  declare ownerId: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => ChatRoomMembership, {
    foreignKey: 'chatRoomId',
  })
  declare chatRoomMemberships: HasMany<typeof ChatRoomMembership>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async getJson(user: User) {
    return {
      id: this.id,
      name: this.name,
      private: this.private,
      isOwner: user.id === this.ownerId,
    }
  }
}
