import { defineStore } from 'pinia';
import { ChatRoom } from 'components/models';


interface SelectedChatState {
  chatRoom: ChatRoom | null;
}

export const useSelectedChatStore = defineStore('chat',{
  state: (): SelectedChatState => ({
    chatRoom: null
  })
})
