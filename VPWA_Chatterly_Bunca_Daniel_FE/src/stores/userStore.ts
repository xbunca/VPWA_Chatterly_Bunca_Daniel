import { defineStore } from 'pinia';
import { User } from 'components/models';

interface UserState {
  user: User;
}

export const useUserStore = defineStore('user',{
  state: (): UserState => ({
    user: {
      id: -1,
      name: 'Name',
      surname: 'Surname',
      nickname: 'nickname',
      email: 'my@email.com',
      status: 1,
      notifyMentionsOnly: false
    }
  })
})
