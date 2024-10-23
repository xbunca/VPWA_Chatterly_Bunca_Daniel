import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.string('nickname').notNullable().unique()
      table.string('email_address', 254).notNullable().unique()
      table.string('password').notNullable()
      table.boolean('notify_mentions_only').notNullable().defaultTo(false)
      table.integer('status_id').notNullable().references('id').inTable('states').defaultTo(2)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
