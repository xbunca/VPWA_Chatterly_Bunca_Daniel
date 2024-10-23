import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_room_kick_votes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('kicker_id').notNullable().references('id').inTable('users')
      table.integer('chat_room_id').notNullable().references('id').inTable('chat_rooms')
      table.integer('user_id').notNullable().references('id').inTable('users')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
