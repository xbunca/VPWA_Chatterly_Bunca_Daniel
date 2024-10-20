<script setup lang="ts">

import { ChatRoom } from 'components/models';
import { useRouter } from 'vue-router';
import { useChatsStore } from 'stores/chatsStore';

const router = useRouter()
const chatsStore = useChatsStore()

const props = withDefaults(defineProps<ChatRoom>(), {});

const leaveRoomButtonClicked = () => {
  const chatIndex = chatsStore.chats.findIndex(chat => chat.id === props.id)
  chatsStore.chats.splice(chatIndex, 1)
  if (chatsStore.selectedChat?.id === props.id) {
    chatsStore.selectedChat = null
    router.push({ name: 'home' })
  }
}

const onCellClicked = () => {
  chatsStore.selectedChat = props;

  router.push({ name: 'chat', params: { id: props.id } });
};


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

    <div id="content-container">
      <p id="chatNameLabel">{{ name }}</p>
      <div id="info-buttons-container">
        <div id="chat-info-container">
          <p v-if="inviteFrom != null" id="invitedByLabel">
            Invite from: <br />@{{ inviteFrom }}
          </p>
        </div>
        <div id="buttons-container">
          <q-btn
            id="leaveRoomButton"
            icon="delete"
            text-color="white"
            color="red"
            size="sm"
            @click.stop="leaveRoomButtonClicked"
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
  gap: 10px;
}

#leaveRoomButton {
  margin-left: 2px;
}

@media (max-width: 300px) {
  #container {
    flex-direction: column;
    align-items: center;
  }

  #content-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #chatNameLabel,
  #chat-info-container {
    display: none;
  }

  #buttons-container {
    flex-direction: row;
    justify-content: center;
    margin-left: 0;
    margin-top: 10px;
  }

  #image-container {
    margin-left: 0;
  }
}

</style>
