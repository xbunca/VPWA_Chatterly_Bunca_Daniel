<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'stores/userStore';
import { generateMessages, useChatsStore } from 'stores/chatsStore';
import { onBeforeUnmount, watch, ref } from 'vue';
import { ChatRoom } from 'src/components/models';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();
const chatsStore = useChatsStore()
const selectedChatRoom = ref<ChatRoom | null>(null);


const loadSelectedChatRoom = (chatId: string | string[]) => {

  const id = Array.isArray(chatId) ? chatId[0] : chatId;

  const chatRoom = chatsStore.chats.find(chat => chat.id.toString() === id);

  if (chatRoom != undefined) {
    chatsStore.selectedChat = chatRoom;
    selectedChatRoom.value = chatRoom;

  } else {
    router.push({ name: 'home' });
  }
};

loadSelectedChatRoom(route.params.id);

watch(
  () => chatsStore.selectedChat,
  (newSelectedChat) => {
    if (newSelectedChat) {
      loadSelectedChatRoom(newSelectedChat.id.toString());
    }
  }
);

watch(
  () => route.params.id,
  (newId) => {
    loadSelectedChatRoom(newId);
  }
);

const onLoad = (index: number, done: (stop?: boolean | undefined) => void): void => {
  setTimeout(() => {
    generateMessages(chatsStore.selectedChat!, userStore.user, Math.floor(Math.random() * (15 - 3 + 1)) + 3);
    done()
  }, Math.floor(Math.random() * (2000 - 500 + 1)) + 500)
}

const isAdressed = (messageContent: string, senderId: number): boolean => {
  if(senderId == userStore.user.id){
    return false
  }
  const text = messageContent.split(' ')
  const userName = userStore.user.nickname;

  for (let index = 0; index < text.length; index++) {
    const element = text[index];
    if(element.includes('@' + userName)) {
      return true
    }

  }
  return false
}

onBeforeUnmount(() => {
  chatsStore.selectedChat = null
})

</script>

<template>
<div id="container">
  <div id="chat-room-info-container">
    <div id="image-container">
      <div id="image">
        <p>{{ selectedChatRoom?.name[0] }}</p>
      </div>
      <q-avatar
        id="roomTypeAvatar"
        color="white"
        size="20px"
        font-size="80%"
        text-color="black"
        :icon="selectedChatRoom?.isPrivate ? 'lock' : 'language'"
      />
    </div>

    <div id="chat-info-container">
      <p id="chatNameLabel">{{ selectedChatRoom?.name }}</p>
      <p v-if="selectedChatRoom?.inviteFrom != null" id="invitedByLabel">Invite from: <br>@{{ selectedChatRoom?.inviteFrom }}</p>
    </div>

    <q-btn
      id="listButton"
      icon="group"
      color="black"
      size="lg"
      @click="chatsStore.chanelUserList = true"
      flat
      rounded
      dense
    />

    <q-btn
      id="closeButton"
      icon="close"
      color="black"
      size="lg"
      @click="router.push({ name: 'home' })"
      flat
      rounded
      dense
    />
  </div>

  <div id="scroll-container" class="scroll q-pa-md">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div id="chat-message-wrapper" v-for="(message, index) in selectedChatRoom?.messages" :key="index">
        <div id="avatar-status-wrapper">
          <q-chat-message
          :avatar="'https://ui-avatars.com/api/?name=' + message.sender.name[0] + '+' + message.sender.surname[0]"
          :name="message.sender.id == userStore.user.id ? '' : message.sender.name + ' ' + message.sender.surname"
          :text="[ message.content ]"
          :bg-color="isAdressed(message.content, message.sender.id)? 'yellow-6' : ''"
          :sent="message.sender.id == userStore.user.id"
          />
          <q-avatar
          v-if="message.sender.id != userStore.user.id"
          id="statusAvatar"
          :color="message.sender.status == 0 ? 'grey' : message.sender.status == 1 ? 'green' : 'red'"
          size="2vh"
          />
        </div>
      </div>

    </q-infinite-scroll>
  </div>

</div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#chat-room-info-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 10%;
  background-color: #dfdddd;
}

#image-container {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
}

#image {
  display: flex;
  height: 50px;
  width: 50px;
  border-radius: 20%;
  background-color: #787878;
  justify-content: center;
  align-items: center;
}

#image p {
  color: white;
  margin-bottom: 0;
  font-size: 280%;
}

#roomTypeAvatar {
  position: relative;
  left: -60px;
  top: 15px;
}

#chatNameLabel {
  font-weight: bold;
  font-size: 120%;
  margin-bottom: 0;
}

#invitedByLabel {
  font-size: 80%;
  margin-bottom: 0;
}

#listButton {
  position: absolute;
  right: 65px;
}

#closeButton {
  position: absolute;
  right: 10px;
}

#scroll-container {
  height: 90%;
  width: 100%;
}

#chat-message-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

#avatar-status-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

#statusAvatar {
  position: absolute;
  bottom: 6px;
  left: 31px;
}

</style>
