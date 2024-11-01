<script setup lang="ts">

import { ChatRoomInvitation } from 'components/models';
import { useChatsStore } from 'stores/chatsStore';
import { respondToChatRoomInvitation } from 'boot/api';
import { useQuasar } from 'quasar';

const chatsStore = useChatsStore()
const q = useQuasar()

const props = withDefaults(defineProps<ChatRoomInvitation>(), {});

const acceptClicked = async () => {

  try {
    const chatRoom = await respondToChatRoomInvitation(props.id, true)
    const invitationIndex = chatsStore.invitations.findIndex(chatInvitation => chatInvitation.id === props.id);
    chatsStore.invitations.splice(invitationIndex, 1);
    if (chatRoom !== null) {
      chatsStore.chatRooms.push(chatRoom)
    }
  } catch (error) {
    if (error instanceof Error) {
      q.notify({
        type: 'negative',
        icon: 'warning',
        message: error.message,
        color: 'red-5',
        position: 'center',
        timeout: 500
      })
    }
  }

}

const rejectClicked = async () => {

  try {
    await respondToChatRoomInvitation(props.id, false)
    const invitationIndex = chatsStore.invitations.findIndex(chatInvitation => chatInvitation.id === props.id);
    chatsStore.invitations.splice(invitationIndex, 1);
  } catch (error) {
    if (error instanceof Error) {
      q.notify({
        type: 'negative',
        icon: 'warning',
        message: error.message,
        color: 'red-5',
        position: 'center',
        timeout: 500
      })
    }
  }

}

</script>

<template>
  <div id="container">
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
        :icon="private ? 'lock' : 'language'"
      />
    </div>

    <div id="chat-info-container">
      <p id="chatNameLabel">{{ name }}</p>
      <p id="invitedByLabel">Invite from: <br>@{{ inviteFrom }}</p>
    </div>

    <q-btn
      id="acceptButton"
      icon="done"
      text-color="white"
      color="green"
      size="md"
      @click="acceptClicked"
      dense
    />

    <q-btn
      id="denyButton"
      icon="close"
      text-color="white"
      color="red"
      size="md"
      @click="rejectClicked"
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
  height: 70px;
  background: #d5d4d4;
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

#acceptButton {
  position: absolute;
  right: 20%;
}

#denyButton {
  position: absolute;
  right: 6%;
}

</style>
