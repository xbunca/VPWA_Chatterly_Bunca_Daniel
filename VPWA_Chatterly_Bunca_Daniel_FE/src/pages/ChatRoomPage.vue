<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/userStore';
import { useSelectedChatStore } from 'stores/selectedChatStore';

const router = useRouter()
const userStore = useUserStore();
const selectedChatRoomStore = useSelectedChatStore()

if (selectedChatRoomStore.chatRoom) {

} else {
  router.push({ name: 'home' })
}

const firstNames: string[] = [
  'John', 'Jane', 'Alice', 'Bob', 'Emily',
  'Michael', 'Sarah', 'David', 'Emma', 'Chris',
  'Olivia', 'James', 'Sophia', 'Liam', 'Isabella',
  'William', 'Ava', 'Ethan', 'Mia', 'Alexander'
];

const lastNames: string[] = [
  'Doe', 'Smith', 'Johnson', 'Brown', 'Davis',
  'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark'
];

const messages: string[] = [
  // Short Messages
  'Hi there!',
  'Good job!',
  'All set!',
  'See you soon!',
  'Try again!',
  'Welcome!',
  'Done!',
  'Error!',

  // Mid-Length Messages
  'Your changes have been saved.',
  'We received your request.',
  'Check your inbox for details.',
  'Your profile has been updated successfully.',
  'You’ve been logged out automatically.',
  'Please complete all required fields.',
  'Action required: Please review your input.',
  'We are processing your request.',

  // Longer Messages
  'Thank you for submitting your feedback! We value your opinion and will take it into consideration.',
  'Your account is now active. You can start exploring the platform and customizing your experience.',
  'We’re sorry, but there was an issue with your request. Please try again or contact support if the issue persists.',
  'Congratulations! Your transaction was successful, and we’ve sent you a confirmation email with all the details.',
  'Your session has expired due to inactivity. Please log in again to continue where you left off.',
  'Thank you for joining our community! We’re excited to have you on board and hope you enjoy your experience.'
];

const onLoad = (index: number, done: (stop?: boolean | undefined) => void): void => {
  setTimeout(() => {
    for (let i = 0; i < 13; i++) {
      const userId = Math.random() > 0.2 ? 4 : userStore.user.id
      selectedChatRoomStore.chatRoom?.messages.unshift({
        id: 3,
        content: messages[Math.floor(Math.random() * messages.length)],
        sender: {
          id: userId,
          name: userId == -1 ? userStore.user.name : firstNames[Math.floor(Math.random() * firstNames.length)],
          surname: userId == -1 ? userStore.user.surname : lastNames[Math.floor(Math.random() * lastNames.length)],
          status: Math.floor(Math.random() * 3)
        }
      })
    }
    done()
  }, Math.floor(Math.random() * (2000 - 500 + 1)) + 500)
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

      <div id="chat-message-wrapper" v-for="(message, index) in selectedChatRoomStore.chatRoom?.messages" :key="index">
        <div id="avatar-status-wrapper">
          <q-chat-message
          :avatar="'https://ui-avatars.com/api/?name=' + message.sender.name[0] + '+' + message.sender.surname[0]"
          :name="message.sender.id == userStore.user.id ? '' : message.sender.name + ' ' + message.sender.surname"
          :text="[ message.content ]"
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
