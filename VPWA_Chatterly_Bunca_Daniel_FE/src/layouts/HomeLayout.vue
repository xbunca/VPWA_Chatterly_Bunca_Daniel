<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StatusListItem from 'components/StatusListItem.vue';
import ChatRoomInvitationListItem from 'components/ChatRoomInvitationListItem.vue';
import ChatRoomListItem from 'components/ChatRoomListItem.vue';
import { useUserStore } from 'stores/userStore';
import { Status } from 'components/models';
import { useChatsStore } from 'stores/chatsStore';

const router = useRouter();

const userStore = useUserStore();
const chatsStore = useChatsStore()

const statuses: Status[] = [
  {
    color: 'grey',
    title: 'Offline',
    onClickEvent: () => {
      userStore.user.status = 0
      selectedStatus.value = statuses[0]
    },
  },
  {
    color: 'green',
    title: 'Online',
    onClickEvent: () => {
      userStore.user.status = 1
      selectedStatus.value = statuses[1]
    },
  },
  {
    color: 'red',
    title: 'Do not disturb',
    onClickEvent: () => {
      userStore.user.status = 2
      selectedStatus.value = statuses[2]
    },
  },
];

const selectedStatus = ref<Status>(statuses[userStore.user.status]);

const logOut = () => {
  router.push({ name: 'login' });
};

const messageField = ref('')

const onSend = () => {
  if (chatsStore.selectedChat != null) {
    chatsStore.selectedChat?.messages.push({
      id: 1,
      content: messageField.value,
      sender: {
        id: userStore.user.id,
        name: userStore.user.name,
        surname: userStore.user.surname,
        nickname: userStore.user.nickname,
        status: userStore.user.status
      }
    });
    messageField.value = '';
  }
}

const addChatTapped = () => {
  router.push({ name: 'joinChat' });
}
</script>

<template>
  <div id="top-container">
    <div id="logo-container" @click="router.push({ name: 'home' })">
      <q-img id="logo" src="src/assets/logo.png" fit="scale-down" />
      <h6>Chatterly</h6>
    </div>
    <div id="account-container">
      <div>
        <q-avatar
          id="accountAvatar"
          color="grey-4"
          size="6.5vh"
          font-size="80%"
          text-color="white"
          :icon="'img:https://ui-avatars.com/api/?name=' + userStore.user.name[0] + '+' + userStore.user.surname[0]"
        />
        <q-btn-dropdown
          id="statusButton"
          :color="selectedStatus.color"
          :text-color="selectedStatus.color"
          size="xs"
          dropdown-icon=""
          round
          dense
        >
          <q-list>
            <StatusListItem
              v-for="status in statuses"
              :key="status.title"
              v-bind="status"
            />
          </q-list>
        </q-btn-dropdown>
      </div>

      <div id="account-info-container">
        <p id="nameSurnameLabel">
          {{ userStore.user.name }} {{ userStore.user.surname }}
        </p>
        <p id="nicknameLabel">@{{ userStore.user.nickname }}</p>
      </div>

      <q-btn-dropdown
        id="settingsButton"
        size="lg"
        dropdown-icon="settings"
        flat
        round
        dense
      >
        <q-list>
          <q-item v-close-popup>
            <q-item-section style="align-items: center" avatar>
              <q-avatar icon="notifications" size="xl" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Notify mentions only </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="userStore.user.notifyMentionsOnly" />
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="logOut">
            <q-item-section style="align-items: center" avatar>
              <q-avatar icon="logout" size="xl" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Log Out </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>

  <div id="main-container">
    <div id="chats-container">
      <div id="chats-list-container">
        <q-scroll-area id="chats-list-scroll">
          <q-list class="flex flex-center" style="row-gap: 10px">
            <p style="margin-bottom: 0; margin-top: 10px">Chat invitations</p>

            <ChatRoomInvitationListItem
              v-for="(invitation, index) in chatsStore.invitations"
              :key="index"
              v-bind="invitation"
            />

            <p style="margin-bottom: 0">Chats</p>

            <ChatRoomListItem
              v-for="(chatRoom, index) in chatsStore.chats"
              :key="index"
              v-bind="chatRoom"
            />
          </q-list>
        </q-scroll-area>
      </div>
      <div id="create-room-container">
        <q-btn
          id="createRoomButton"
          color="green"
          icon="add"
          unelevated
          dense
          @click="addChatTapped"
        />
      </div>
    </div>
    <div id="room-container">
      <div id="messages-container">
        <router-view />
      </div>
      <div id="filed-container">
        <q-input
          id="messagesField"
          v-model="messageField"
          placeholder="Message/Command"
          @keydown.enter="onSend"
          outlined
          dense
          :style="{ width: '90%' }"
        />
        <q-btn
          id="sendButton"
          icon="send"
          size="lg"
          color="blue"
          @click="onSend"
          round
          dense
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#top-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 8vh;
  position: relative;
}

#logo-container {
  width: 20%;
  height: 100%;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}

#logo {
  height: 90%;
  width: 20%;
}

#account-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
}

#account-info-container {
  margin-left: 0.8%;
}

#statusButton {
  position: absolute;
  bottom: 10%;
  left: 4.5vh;
}

#nameSurnameLabel {
  font-weight: bold;
  margin-bottom: 0;
}

#nicknameLabel {
  margin-bottom: 0;
}

#settingsButton {
  position: absolute;
  right: 1%;
}

#main-container {
  height: 92vh;
  width: 100%;
  display: flex;
  flex-direction: row;
}

#chats-container {
  width: 20%;
  height: 100%;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
}

#chats-list-container {
  width: 100%;
  height: 91%;
}

#chats-list-scroll {
  width: 100%;
  height: 100%;
}

#create-room-container {
  display: flex;
  width: 100%;
  height: 9%;
  justify-content: center;
  align-items: center;
}

#createRoomButton {
  width: 80%;
}

#room-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#messages-container {
  width: 100%;
  height: 90%;
}

#filed-container {
  display: flex;
  gap: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 10%;
}
</style>
