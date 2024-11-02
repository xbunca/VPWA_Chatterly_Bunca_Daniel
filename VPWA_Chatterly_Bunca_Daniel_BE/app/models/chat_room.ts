import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ChatRoomMembership from '#models/chat_room_membership'
import Message from '#models/message'

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

  @hasMany(() => Message, {
    foreignKey: 'chatRoomId',
  })
  declare messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async getJson(user: User) {
    // @ts-ignore
    await this.load('chatRoomMemberships')
    let inviterNickname = null
    for (const userMembership of this.chatRoomMemberships) {
      if (userMembership.userId === user.id && userMembership.inviteId !== null) {
        await userMembership.load('invitation')
        await userMembership.invitation.load('inviter')
        inviterNickname = userMembership.invitation.inviter.nickname
        break
      }
    }
    return {
      id: this.id,
      name: this.name,
      private: this.private,
      isOwner: user.id === this.ownerId,
      inviteFrom: inviterNickname,
    }
  }

  async getJsonDetail(user: User) {
    const listItemJson = await this.getJson(user)

    const usersList: User[] = []

    // @ts-ignore
    await this.load('owner')
    usersList.push(this.owner)

    for (const chatMembership of this.chatRoomMemberships) {
      await chatMembership.load('user')
      usersList.push(chatMembership.user)
    }

    return {
      id: listItemJson.id,
      name: listItemJson.name,
      private: listItemJson.private,
      isOwner: listItemJson.isOwner,
      inviteFrom: listItemJson.inviteFrom,
      users: usersList.map((u) => {
        return {
          name: u.name,
          surname: u.surname,
          nickname: u.nickname,
          stateId: u.stateId,
        }
      }),
    }
  }
}
