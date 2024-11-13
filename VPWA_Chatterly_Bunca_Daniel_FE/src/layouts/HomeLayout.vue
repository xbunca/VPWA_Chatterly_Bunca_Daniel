<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import StatusListItem from 'components/StatusListItem.vue';
import ChatRoomInvitationListItem from 'components/ChatRoomInvitationListItem.vue';
import ChatRoomListItem from 'components/ChatRoomListItem.vue';
import { useUserStore } from 'stores/userStore';
import { UserState } from 'components/models';
import { useChatsStore } from 'stores/chatsStore';
import ChanelUserListItem from 'components/ChanelUserListItem.vue';
import {
  authenticateSocket,
  getAccountDetail,
  getChatRoomInvitations,
  getChatRooms, getSettings,
  logoutUser, 
  updateNotifyMentionsOnly
} from 'boot/api';
import { useSettingsStore } from 'stores/settingsStore';
import { useQuasar } from 'quasar';
import { handleCommand } from '../services/commandsService'

const router = useRouter();
const q = useQuasar()

const userStore = useUserStore();
const settingsStore = useSettingsStore()

if (userStore.accessToken === null) {
  router.replace({ name: 'login' })
}

if (Notification.permission !== 'granted') {
  Notification.requestPermission()
}

onBeforeMount(async () => {
  await authenticateSocket()

  try {
    const settings = await getSettings()
    settingsStore.userStates = settings.userStates
  } catch (e) {}

  try {
    const accountDetail = await getAccountDetail()
    userStore.user = {
      name: accountDetail.name,
      surname: accountDetail.surname,
      nickname: accountDetail.nickname,
      notifyMentionsOnly: accountDetail.notifyMentionsOnly,
      stateId: accountDetail.stateId,
    }
  } catch (e) {

  }
})

const chatsStore = useChatsStore();

onBeforeMount(async () => {
  try {
    chatsStore.chatRooms = await getChatRooms()
  } catch (e) {

  }
})

onBeforeMount(async () => {
  try {
    chatsStore.invitations = await getChatRoomInvitations()
  } catch (e) {

  }
})

const selectedUserState = ref<UserState>(settingsStore.userStates.find(s => s.id === userStore.user.stateId)!);

watch(
  () => userStore.user.stateId,
  (newStateId) => {
    selectedUserState.value = settingsStore.userStates.find(s => s.id === newStateId)!;
  }
)

watch(
  () => userStore.user.notifyMentionsOnly,
  async (newValue) => {
    const account = await updateNotifyMentionsOnly(newValue);
    userStore.user.notifyMentionsOnly = account.notifyMentionsOnly
  }
)

const logOut = async () => {
  try {
    await logoutUser()
    await router.push({ name: 'login' });
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
};

const messageField = ref('');

const innerWidth = ref(window.innerWidth);
const updateScreenWidth = () => {
  innerWidth.value = window.innerWidth;
};

onBeforeMount(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const showChatRoomsListTapped = () => {
  chatsStore.chatListToggle = !chatsStore.chatListToggle;
}

const onSend = async () => {
  const message = messageField.value;
  handleCommand(message)

  messageField.value = '';
};


const addChatTapped = () => {
  chatsStore.chatListToggle = false;
  router.push({ name: 'joinChat' });
};
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
          :icon="
            'img:https://ui-avatars.com/api/?name=' +
            userStore.user.name[0] +
            '+' +
            userStore.user.surname[0]
          "
        />
        <q-btn-dropdown
          id="statusButton"
          :color="selectedUserState.color"
          :text-color="selectedUserState.color"
          size="xs"
          dropdown-icon=""
          round
          dense
        >
          <q-list>
            <StatusListItem
              v-for="userState in settingsStore.userStates"
              :key="userState.id"
              v-bind="userState"
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
    <div id="chats-container" :style="{ display: innerWidth > 1030 ? 'block' : chatsStore.chatListToggle ? 'block' : 'none',  width: innerWidth > 1030 ? '250px' : '100%' }">
      <div id="chats-list-container">
        <q-scroll-area id="chats-list-scroll">
          <q-list class="flex flex-center" style="row-gap: 10px">
            <p
              v-if="chatsStore.invitations.length !== 0"
              style="margin-bottom: 0; margin-top: 10px; width: 200px; text-align: center;"
            >
              Chat invitations
            </p>

            <ChatRoomInvitationListItem
              v-for="(invitation, index) in chatsStore.invitations"
              :key="index"
              v-bind="invitation"
            />

            <p
              :style="{
                marginBottom: '0',
                marginTop: chatsStore.invitations.length === 0 ? '10px' : '0px',
                width: '200px',
                textAlign: 'center'
              }"
            >
              Chats
            </p>

            <ChatRoomListItem
              v-for="chatRoom in chatsStore.chatRooms"
              :key="chatRoom.id"
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
    <div id="room-container" :style="{ display: innerWidth > 1030 ? 'block' : !chatsStore.chatListToggle ? 'block' : 'none' }">
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

  <q-dialog v-model="chatsStore.chanelUserList">
    <q-card style="width: 100%">
      <q-card-section>
        <div class="text-h6">
          User list in {{ chatsStore.selectedChat?.name }} chat
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <ChanelUserListItem
          v-for="(sender, index) in chatsStore.selectedChat?.users"
          :key="index"
          v-bind="sender"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-btn
    id="showChatRoomsListButton"
    icon="chevron_right"
    color="black"
    text-color="white"
    size="30px"
    @click="showChatRoomsListTapped"
    :style="{ left: chatsStore.chatListToggle ? '' : '0px', right: chatsStore.chatListToggle ? '0px' : '', transform: chatsStore.chatListToggle ? 'rotate(180deg)' : 'rotate(0deg)' }"
    round
    dense
  />
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
  width: 250px;
  height: 100%;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  background-color: #ededed;
}

#logo {
  height: 90%;
  width: 20%;
}

#account-container {
  flex-grow: 1;
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
  width: 250px;
  height: 100%;
  background: #e4e2e2;
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
  flex-grow: 1;
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

#showChatRoomsListButton {
  position: absolute;
  top: 45%;
  display: none;
  opacity: 70%;
}

@media (max-width: 1030px) {
  #logo-container {
    width: 150px;
  }

  #showChatRoomsListButton {
    display: block;
  }
}

</style>
