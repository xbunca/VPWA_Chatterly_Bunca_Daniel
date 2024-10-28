import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'message_mentions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table
        .integer('message_id')
        .notNullable()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')
      table.integer('user_id').notNullable().references('id').inTable('users')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
