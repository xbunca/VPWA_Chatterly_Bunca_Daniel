<script setup lang="ts">

import { ChatRoom } from 'components/ChatRoomListItem.vue';

export interface ChatRoomInvitation extends ChatRoom {

}

withDefaults(defineProps<ChatRoomInvitation>(), {

});

const emits = defineEmits(['acceptClicked', 'rejectClicked']);

</script>

<template>
  <div id="container">
    <div id="image-container">
      <div id="image">

      </div>
      <q-avatar
        id="roomTypeAvatar"
        color="white"
        size="20px"
        font-size="80%"
        text-color="black"
        :icon="isPrivate ? 'lock' : 'language'"
      />
    </div>

    <div id="chat-info-container">
      <p id="chatNameLabel">ChatName</p>
      <p id="invitedByLabel">Invite from: <br>@nickname</p>
    </div>

    <q-btn
      id="acceptButton"
      icon="done"
      text-color="white"
      color="green"
      size="md"
      @click="emits('acceptClicked')"
      dense
    />

    <q-btn
      id="denyButton"
      icon="close"
      text-color="white"
      color="red"
      size="md"
      @click="emits('rejectClicked')"
      dense
    />
  </div>
</template>

<style scoped>

#container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  height: 8vh;
  background: #d5d4d4;
}

#image-container {
  display: flex;
  flex-direction: row;
  margin-left: 4%;
}

#image {
  height: 50px;
  width: 50px;
  border-radius: 20%;
  background-color: #787878;
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

#acceptButton {
  position: absolute;
  right: 24%;
}

#denyButton {
  position: absolute;
  right: 10%;
}

</style>
