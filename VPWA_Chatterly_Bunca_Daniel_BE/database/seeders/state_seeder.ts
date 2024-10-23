import { BaseSeeder } from '@adonisjs/lucid/seeders'
import State from '#models/state'

export default class extends BaseSeeder {
  async run() {
    await State.createMany([
      {
        name: 'Offline',
        color: '#9e9e9e',
      },
      {
        name: 'Online',
        color: '#4caf50',
      },
      {
        name: 'Do not disturb',
        color: '#f44336',
      },
    ])
  }
}
