import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ChatRoom from '#models/chat_room'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column()
  declare senderId: number

  @column()
  declare chatRoomId: number

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => ChatRoom, {
    foreignKey: 'chatRoomId',
  })
  declare chatRoom: BelongsTo<typeof ChatRoom>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async getJson(user: User) {
    // @ts-ignore
    await this.load('sender')
    return {
      id: this.id,
      content: this.content,
      isMine: this.senderId === user.id,
      sender: {
        name: this.sender.name,
        surname: this.sender.surname,
        nickname: this.sender.nickname,
        stateId: this.sender.stateId,
      },
    }
  }
}
