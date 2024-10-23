import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_room_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.integer('chat_room_id').notNullable().references('id').inTable('chat_rooms')
      table.integer('invite_id').nullable().references('id').inTable('chat_room_invitations')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
