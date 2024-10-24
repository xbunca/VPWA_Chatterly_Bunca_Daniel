import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import State from '#models/state'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  async getAccountJson() {
    return {
      name: this.name,
      surname: this.surname,
      nickname: this.nickname,
      notifyMentionsOnly: this.notifyMentionsOnly,
      stateId: this.stateId,
    }
  }
}
