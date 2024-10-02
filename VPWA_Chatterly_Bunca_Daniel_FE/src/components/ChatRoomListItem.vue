<script setup lang="ts">

import { ChatRoom } from 'components/models';
import { useSelectedChatStore } from 'stores/selectedChatStore';
import { useRouter } from 'vue-router';

const router = useRouter()

const selectedChatStore = useSelectedChatStore()

const props = withDefaults(defineProps<ChatRoom>(), {});

const emits = defineEmits(['deleteClicked'])

const leaveRoomButtonClicked = () => {
  emits('deleteClicked')
}

const onCellClicked = () => {
  selectedChatStore.chatRoom = props
  router.push({ name: 'chat' })
}

</script>

<template>
<div id="container" @click="onCellClicked">
  <div id="image-container">
    <div id="image">
      <p>{{ name[0] }}</p>
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
    <p id="chatNameLabel">{{ name }}</p>
    <p v-if="inviteFrom != null" id="invitedByLabel">Invite from: <br>@{{ inviteFrom }}</p>
  </div>

  <q-btn
    id="leaveRoomButton"
    icon="delete"
    text-color="white"
    color="red"
    size="md"
    @click.stop="leaveRoomButtonClicked"
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
  cursor: pointer;
}

#image-container {
  display: flex;
  flex-direction: row;
  margin-left: 4%;
}

#image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  border-radius: 20%;
  background-color: #787878;
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

#leaveRoomButton {
  position: absolute;
  right: 10%;
}

</style>
