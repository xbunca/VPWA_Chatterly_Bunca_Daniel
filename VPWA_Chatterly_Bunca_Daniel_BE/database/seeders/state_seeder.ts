import { BaseSeeder } from '@adonisjs/lucid/seeders'
import State from '#models/state'

export default class extends BaseSeeder {
  async run() {
    await State.createMany([
      {
        name: 'Offline',
        color: 'grey',
      },
      {
        name: 'Online',
        color: 'green',
      },
      {
        name: 'Do not disturb',
        color: 'red',
      },
    ])
  }
}
