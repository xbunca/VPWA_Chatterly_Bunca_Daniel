<script setup lang="ts">

import { ref } from 'vue';
import { useChatsStore } from 'stores/chatsStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';

const q = useQuasar()
const router = useRouter()

const userStore = useUserStore();
const chatsStore = useChatsStore()

const joinChatField = ref('')

const createChatField = ref('')
const isPrivateRoom = ref(false)

const joinTapped = () => {

}

const createTapped = () => {
  const chatRoomName = createChatField.value

  if (chatsStore.chats.find(chat => chat.name === chatRoomName) !== undefined) {
    q.notify({
      type: 'negative',
      icon: 'warning',
      message: 'Chat with this name already exists!',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  const chatId = chatsStore.chats.length + 4

  chatsStore.chats.push({
    id: chatId,
    name: chatRoomName,
    ownerId: userStore.user.id,
    isPrivate: isPrivateRoom.value,
    inviteFrom: null,
    users: [],
    messages: []
  })

  router.push( { name: 'chat', params: { id: chatId } } )
}

</script>

<template>
<div id="container">
  <h4>Create or join a chat</h4>
  <q-input
    id="joinChatRoomField"
    v-model="joinChatField"
    type="text"
    label="Chat room name"
    :style="{ width: '30%' }"
    outlined
  />
  <q-btn
    id="joinButton"
    label="Join"
    color="black"
    text-color="white"
    no-caps
    @click="joinTapped"
  />
  <h5>or</h5>
  <q-input
    id="createChatRoomField"
    v-model="createChatField"
    type="text"
    label="Chat room name"
    :style="{ width: '30%' }"
    outlined
  />
  <div style="width: 30%">
    <q-checkbox
      v-model="isPrivateRoom"
      label="Private room"
    />
  </div>
  <q-btn
    id="createButton"
    label="Create"
    color="black"
    text-color="white"
    no-caps
    @click="createTapped"
  />
</div>
</template>

<style scoped>

#container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

#container h4, h5 {
  text-align: center;
}

#joinButton {
  width: 20%;
}

#createButton {
  width: 20%;
}



</style>
