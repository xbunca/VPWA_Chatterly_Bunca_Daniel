import { UserState } from 'components/models';
import { defineStore } from 'pinia';
import { SettingsResponse } from 'boot/api';

interface Settings {
  userStates: UserState[];
}

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    userStates: getUserStates()
  })
})

function getUserStates(): UserState[] {
  try {
    const settingsString = localStorage.getItem('settings')
    if (settingsString) {
      const data: SettingsResponse = JSON.parse(settingsString)
      return data.userStates.map((userStateData) => {
        return {
          id: userStateData.id,
          name: userStateData.name,
          color: userStateData.color,
        };
      });
    }
  } catch (e) {}

  return []
}
