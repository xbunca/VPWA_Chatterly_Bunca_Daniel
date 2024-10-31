import { defineStore } from 'pinia';
import { User } from 'components/models';

interface UserState {
  user: User;
  accessToken: string | null;
}

export const useUserStore = defineStore('user',{
  state: (): UserState => ({
    user: {
      name: '--',
      surname: '--',
      nickname: '--',
      stateId: 1,
      notifyMentionsOnly: false
    },
    accessToken: localStorage.getItem('accessToken'),
  })
})
