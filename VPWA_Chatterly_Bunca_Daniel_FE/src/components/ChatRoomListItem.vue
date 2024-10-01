<script setup lang="ts">

export interface ChatRoom {
  isPrivate?: boolean;
  isOwner?: boolean;
}

withDefaults(defineProps<ChatRoom>(), {});

const emits = defineEmits(['deleteClicked'])

const leaveRoomButtonClicked = () => {
  emits('deleteClicked')
}

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
    <p v-if="isOwner" id="invitedByLabel">Invite from: <br>@nickname</p>
  </div>

  <q-btn
    id="leaveRoomButton"
    icon="delete"
    text-color="white"
    color="red"
    size="md"
    @click="leaveRoomButtonClicked"
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

#leaveRoomButton {
  position: absolute;
  right: 10%;
}

</style>
