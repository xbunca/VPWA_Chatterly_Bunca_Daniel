<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/userStore';
import { useSelectedChatStore } from 'stores/selectedChatStore';

const router = useRouter()
const userStore = useUserStore();
const selectedChatRoomStore = useSelectedChatStore()

if (selectedChatRoomStore.chatRoom == null) {
  router.push({ name: 'home' })
}

const onLoad = (index: number, done: (stop?: boolean | undefined) => void): void => {
  setTimeout(() => {
    for (let i = 0; i < 13; i++) {
      selectedChatRoomStore.chatRoom?.messages.unshift({
        id: 3,
        content: 'Dsfsdfdsgjsdngjnsgjn',
        sender: {
          id: Math.random() > 0.2 ? 4 : -1,
          name: 'Name',
          surname: 'Surname',
          status: Math.floor(Math.random() * 3),
        }
      })
    }
    done()
  }, 2000)
}

</script>

<template>
<div id="container">
  <div id="chat-room-info-container">
    <div id="image-container">
      <div id="image">
        <p>{{ selectedChatRoomStore.chatRoom?.name[0] }}</p>
      </div>
      <q-avatar
        id="roomTypeAvatar"
        color="white"
        size="20px"
        font-size="80%"
        text-color="black"
        :icon="selectedChatRoomStore.chatRoom?.isPrivate ? 'lock' : 'language'"
      />
    </div>

    <div id="chat-info-container">
      <p id="chatNameLabel">{{ selectedChatRoomStore.chatRoom?.name }}</p>
      <p v-if="selectedChatRoomStore.chatRoom?.inviteFrom != null" id="invitedByLabel">Invite from: <br>@{{ selectedChatRoomStore.chatRoom?.inviteFrom }}</p>
    </div>

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

      <q-chat-message
        v-for="(message, index) in selectedChatRoomStore.chatRoom?.messages"
        :key="index"
        :name="message.sender.name + ' ' + message.sender.surname"
        :text="[ message.content ]"
        :sent="message.sender.id == userStore.user.id"
      />
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
  margin-left: 1%;
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

#closeButton {
  position: absolute;
  right: 0.8%;
}

#scroll-container {
  height: 90%;
  width: 100%;
}

</style>
