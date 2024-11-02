import { defineStore } from 'pinia';
import { ChatRoom, ChatRoomInvitation } from 'components/models';


interface ChatsState {
  invitations: ChatRoomInvitation[];
  chatRooms: ChatRoom[];
  chatListToggle: boolean;
  chanelUserList: boolean;
  selectedChat: ChatRoom | null;
}

export const useChatsStore = defineStore('chats',{
  state: (): ChatsState => ({
    invitations: [],
    chatRooms: [],
    chatListToggle: false,
    chanelUserList: false,
    selectedChat: null
  })
})

