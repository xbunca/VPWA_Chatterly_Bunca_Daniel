import { UserState } from 'components/models';
import { defineStore } from 'pinia';

interface Settings {
  userStates: UserState[];
}

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    userStates: [
      {
        id: 1,
        color: 'grey',
        name: 'Offline',
      },
      {
        id: 2,
        color: 'green',
        name: 'Online',
      },
      {
        id: 3,
        color: 'red',
        name: 'Do not disturb',
      },
    ]
  })
})
