import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import State from '#models/state'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ChatRoomInvitation from '#models/chat_room_invitation'
import ChatRoom from '#models/chat_room'
import ChatRoomMembership from '#models/chat_room_membership'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email_address', 'nickname'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare surname: string

  @column()
  declare nickname: string

  @column()
  declare emailAddress: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare notifyMentionsOnly: boolean

  @column()
  declare stateId: number

  @belongsTo(() => State, {
    foreignKey: 'stateId',
  })
  declare state: BelongsTo<typeof State>

  @hasMany(() => ChatRoomInvitation, {
    foreignKey: 'userId',
    onQuery: (query) => {
      query.whereNull('accepted')
    },
  })
  declare chatRoomInvitations: HasMany<typeof ChatRoomInvitation>

  @hasMany(() => ChatRoom, {
    foreignKey: 'ownerId',
  })
  declare ownedChatRooms: HasMany<typeof ChatRoom>

  @hasMany(() => ChatRoomMembership, {
    foreignKey: 'userId',
  })
  declare chatRoomMemberships: HasMany<typeof ChatRoomMembership>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  async getJson() {
    return {
      name: this.name,
      surname: this.surname,
      nickname: this.nickname,
      notifyMentionsOnly: this.notifyMentionsOnly,
      stateId: this.stateId,
    }
  }

  async getChatRoomInvitationsJson() {
    await this.load('chatRoomInvitations')
    const invitations = []
    for (const chatRoomInvitation of this.chatRoomInvitations) {
      await chatRoomInvitation.load('inviter')
      await chatRoomInvitation.load('chatRoom')
      invitations.push(await chatRoomInvitation.getJson())
    }
    return invitations
  }

  async getChatRoomsJson() {
    await this.load('ownedChatRooms')
    await this.load('chatRoomMemberships')
    const chatRooms = []
    for (const ownedChatRoom of this.ownedChatRooms) {
      chatRooms.push(await ownedChatRoom.getJson(this))
    }
    for (const chatRoomMembership of this.chatRoomMemberships) {
      await chatRoomMembership.load('chatRoom')
      chatRooms.push(await chatRoomMembership.chatRoom.getJson(this))
    }
    return chatRooms
  }
}
