import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  createChatRoom,
  joinChatRoom,
  inviteToChatRoom,
  leaveChatRoom,
  revokeUser,
  sendMessage,
  kickUser,
} from 'boot/api'
import { useChatsStore } from 'stores/chatsStore'

const router = useRouter()
const q = useQuasar()
const chatsStore = useChatsStore()

export const handleCommand = async (message: string) => {
  const chatIsSelected = chatsStore.selectedChat != null

  const command = message.split(' ')[0]
  switch (command) {
    case '/list':
      if (chatIsSelected) {
        chatsStore.chanelUserList = true
      }
      break
    case '/join':
      await joinChannelCommand(message)
      break
    case '/invite':
      await inviteCommand(message)
      break
    case '/quit':
      await quitCommand()
      break
    case '/revoke':
      await revokeCommand(message)
      break
    case '/kick':
      await kickCommand(message);
      break
    case '/cancel':
      if (chatIsSelected) {
        await leaveSelectedChat()
      }
      break
    default:
      if (chatsStore.selectedChat !== null) {
        await sendMessage(chatsStore.selectedChat.id, message)
      }
  }
}

const joinChannelCommand = async (message: string) => {
  const channelName = message.split(' ')[1]
  const isPrivate = message.split(' ')[2] === 'private'
  try {
    const chatRoom = isPrivate
      ? await createChatRoom(channelName, true)
      : await joinChatRoom(channelName)
    chatsStore.chatRooms.push(chatRoom)
    await router.push({ name: 'chat', params: { id: chatRoom.id } })
    } catch (error) {
        if (error instanceof Error) {
            q.notify({
            type: 'negative',
            icon: 'warning',
            message: error.message,
            color: 'red-5',
            position: 'center',
            timeout: 500,
            })
        }  
    }
}

const inviteCommand = async (message: string) => {
  const userName = message.split(' ')[1]
  if (chatsStore.selectedChat) {
    try {
      await inviteToChatRoom(chatsStore.selectedChat.id, userName)
    } catch (error) {
        if (error instanceof Error) {
            q.notify({
              type: 'negative',
              icon: 'warning',
              message: error.message,
              color: 'red-5',
              position: 'center',
              timeout: 500,
            })
        }
    }
  }
}

const quitCommand = async () => {
  if (chatsStore.selectedChat && chatsStore.selectedChat.isOwner) {
    await leaveSelectedChat()
  } else {
    q.notify({
      type: 'negative',
      icon: 'warning',
      message: 'You are not the owner',
      color: 'red-5',
      position: 'center',
      timeout: 500,
    })
  }
}

const revokeCommand = async (message: string) => {
    const userName = message.split(' ')[1];
    if (chatsStore.selectedChat && userName) {
      try {
        await revokeUser(chatsStore.selectedChat.id, userName);
        q.notify({
          type: 'positive',
          icon: 'done',
          message: `${userName} has been revoked from the chat.`,
          color: 'green-5',
          position: 'center',
          timeout: 500,
        });
      } catch (error) {
        if (error instanceof Error) {
          q.notify({
            type: 'negative',
            icon: 'warning',
            message: error.message,
            color: 'red-5',
            position: 'center',
            timeout: 500,
          });
        }
      }
    }
  };
  

const leaveSelectedChat = async () => {
  try {
    await leaveChatRoom(chatsStore.selectedChat!.id)
    const chatIndex = chatsStore.chatRooms.findIndex(
      (chat) => chat.id === chatsStore.selectedChat!.id
    )
    chatsStore.chatRooms.splice(chatIndex, 1)
    chatsStore.selectedChat = null
    await router.push({ name: 'home' })
  } catch (error) {
    if (error instanceof Error) {
        q.notify({
          type: 'negative',
          icon: 'warning',
          message: error.message,
          color: 'red-5',
          position: 'center',
          timeout: 500,
        })
      }
  }
}

const kickCommand = async (message: string) => {
    const userName = message.split(' ')[1];
    if (chatsStore.selectedChat && userName) {
      try {
        await kickUser(chatsStore.selectedChat.id, userName);
        q.notify({
          type: 'positive',
          icon: 'done',
          message: `${userName} has been kicked or voted to kick.`,
          color: 'green-5',
          position: 'center',
          timeout: 500,
        });
      } catch (error) {
        if (error instanceof Error) {
          q.notify({
            type: 'negative',
            icon: 'warning',
            message: error.message,
            color: 'red-5',
            position: 'center',
            timeout: 500,
          });
        }
      }
    }
  };