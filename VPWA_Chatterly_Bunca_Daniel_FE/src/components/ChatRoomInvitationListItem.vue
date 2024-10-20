<script setup lang="ts">

import { ChatRoomInvitation } from 'components/models';
import { useChatsStore } from 'stores/chatsStore';

const chatsStore = useChatsStore()

const props = withDefaults(defineProps<ChatRoomInvitation>(), {});

const acceptClicked = () => {
  const invitationIndex = chatsStore.invitations.findIndex(chatInvitation => chatInvitation.id === props.id);
  const invitation = chatsStore.invitations[invitationIndex];
  chatsStore.invitations.splice(invitationIndex, 1);
  chatsStore.chats.push(invitation)
}

const rejectClicked = () => {
  const invitationIndex = chatsStore.invitations.findIndex(chatInvitation => chatInvitation.id === props.id);
  chatsStore.invitations.splice(invitationIndex, 1);
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
        :icon="isPrivate ? 'lock' : 'language'"
      />
    </div>

    <div id="content-container">
      <p id="chatNameLabel">{{ name }}</p>
      <div id="info-buttons-container">
        <div id="chat-info-container">
          <p id="invitedByLabel">Invite from: <br>@{{ inviteFrom }}</p>
        </div>
        <div id="buttons-container">
          <q-btn
            id="acceptButton"
            icon="done"
            text-color="white"
            color="green"
            size="sm"
            @click="acceptClicked"
            dense
          />
          <q-btn
            id="denyButton"
            icon="close"
            text-color="white"
            color="red"
            size="sm"
            @click="rejectClicked"
            dense
          />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
#container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  height: auto;
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

#content-container {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex-grow: 1;
}

#chatNameLabel {
  font-weight: bold;
  font-size: 120%;
  margin-bottom: 5px;
}

#info-buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#chat-info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#invitedByLabel {
  font-size: 80%;
  margin-bottom: 0;
}

#buttons-container {
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-right: 5px;
}

#acceptButton {
  margin-left: 2px;
}

#denyButton {
  margin-left: 2px;
}

</style>
