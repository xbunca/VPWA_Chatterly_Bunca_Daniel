<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StatusListItem from "components/StatusListItem.vue";
import ChatRoomInvitationListItem from "components/ChatRoomInvitationListItem.vue";
import ChatRoomListItem from "components/ChatRoomListItem.vue";

const router = useRouter();

const notifyMentionsOnly = ref(false);

const statusColor = ref("green")

const setOffline = () => {
  statusColor.value = "grey"
}

const setOnline = () => {
  statusColor.value = "green"
}

const setDnd = () => {
  statusColor.value = "red"
}

const logOut = () => {
  router.push({ name: 'login' })
}

</script>

<template>
  <div id="top-container">
    <div id="logo-container">
      <q-img
        id="logo"
        src="src/assets/logo.png"
        fit="scale-down"
      />
      <h6>
        Chatterly
      </h6>
    </div>
    <div id="account-container">

      <div>
        <q-avatar
          id="accountAvatar"
          color="grey-8"
          size="6.5vh"
          font-size="80%"
          text-color="white"
          icon="person"
        />
        <q-btn-dropdown
          id="statusButton"
          :color="statusColor"
          :text-color="statusColor"
          size="xs"
          dropdown-icon=""
          round
          dense>

          <q-list>

            <StatusListItem color="grey" title="Offline" :on-click-event="setOffline"/>
            <StatusListItem  color="green" title="Online" :on-click-event="setOnline"/>
            <StatusListItem  color="red" title="Do not disturb" :on-click-event="setDnd"/>

          </q-list>

        </q-btn-dropdown>
      </div>

      <div id="account-info-container">
        <p id="nameSurnameLabel">MyName MySurname</p>
        <p id="nicknameLabel">@MyNickname</p>
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
            <q-item-section
              style="align-items: center"
              avatar>
              <q-avatar
                icon="notifications"
                size="xl"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                Notify mentions only
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="notifyMentionsOnly"/>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="logOut">
            <q-item-section
              style="align-items: center"
              avatar>
              <q-avatar
                icon="logout"
                size="xl"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                Log Out
              </q-item-label>
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
          <q-list class="flex flex-center">
            <p>Chat invitations</p>

            <ChatRoomInvitationListItem :is-private="true"/>
            <ChatRoomInvitationListItem :is-private="false"/>
            <ChatRoomInvitationListItem :is-private="false"/>

            <p>Chats</p>

            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="false"/>
            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="false"/>
            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="false"/>
            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="false"/>
            <ChatRoomListItem :is-private="false"/>
            <ChatRoomListItem :is-private="true"/>
            <ChatRoomListItem :is-private="true"/>

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
          model-value=""
          placeholder="Message/Command"
          outlined
          dense
          :style="{ width: '90%' }"
        />
        <q-btn
          id="sendButton"
          icon="send"
          size="lg"
          color="blue"
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
