<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useChatsStore } from 'stores/chatsStore';
import { onBeforeUnmount, watch, ref, nextTick } from 'vue';
import { getChatRoomDetails, getChatRoomMessages } from 'boot/api';
import { useSettingsStore } from 'stores/settingsStore';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';

const router = useRouter();
const route = useRoute();
const chatsStore = useChatsStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const q = useQuasar();

const allMessagesLoaded = ref(false);
let isLoading = false;

const refreshCurrentChat = async () => {
  if (!chatsStore.selectedChat) return;

  try {
    const chatId = chatsStore.selectedChat.id;
    const chatDetails = await getChatRoomDetails(chatId);
    chatsStore.selectedChat.users = chatDetails.users;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, messages] = await getChatRoomMessages(chatId, 50, null);
    chatsStore.selectedChat.messages = messages;

  } catch (error) {
    if (error instanceof Error) {
      q.notify({
        type: 'negative',
        icon: 'warning',
        message: error.message,
        color: 'red-5',
        position: 'center',
        timeout: 500,
      });
    }
  }
};

watch(
  () => userStore.user.stateId,
  async (newStateId, oldStateId) => {
    if (oldStateId === 1 && newStateId !== 1) {
      await refreshCurrentChat();
    }
  }
);

const loadSelectedChatRoom = async (chatId: string | string[]) => {
  const id = Array.isArray(chatId) ? Number(chatId[0]) : Number(chatId);

  const chatRoom = chatsStore.chatRooms.find((chat) => chat.id === id);

  if (chatRoom != undefined) {
    chatsStore.selectedChat = chatRoom;
    chatsStore.selectedChat.users = (await getChatRoomDetails(id)).users;
  } else {
    await router.push({ name: 'home' });
  }
};

watch(
  () => route.params.id,
  (newId) => {
    allMessagesLoaded.value = false;
    loadSelectedChatRoom(newId);
  },
  { immediate: true }
);

const onLoad = (index: number, done: (stop?: boolean | undefined) => void): void => {
  if (isLoading || allMessagesLoaded.value) {
    done(true);
    return;
  }

  isLoading = true;

  (async () => {
    try {
      const [chatId, newMessages] = await getChatRoomMessages(
        chatsStore.selectedChat!.id,
        20,
        chatsStore.selectedChat!.messages.length > 0 ? chatsStore.selectedChat!.messages[0].id : null
      );

      const chatRoom = chatsStore.chatRooms.find((chat) => chat.id === chatId);

      if (newMessages.length > 0) {
        chatRoom?.messages.unshift(...newMessages);
      } else {
        allMessagesLoaded.value = true;
        done(true);
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
        });
      }
    }

    done();
    isLoading = false;
  })();
};

const scrollContainer = ref<HTMLDivElement | null>(null);
watch(
  () => chatsStore.selectedChat?.messages[chatsStore.selectedChat.messages.length - 1],
  () => {
    (async () => {
      await nextTick()
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      }
    })()
  }
)

onBeforeUnmount(() => {
  chatsStore.selectedChat = null;
});
</script>

<template>
  <div id="container">
    <div id="chat-room-info-container">
      <div id="image-container">
        <div id="image">
          <p>{{ chatsStore.selectedChat?.name[0] }}</p>
        </div>
        <q-avatar
          id="roomTypeAvatar"
          color="white"
          size="20px"
          font-size="80%"
          text-color="black"
          :icon="chatsStore.selectedChat?.private ? 'lock' : 'language'"
        />
      </div>

      <div id="chat-info-container">
        <p id="chatNameLabel">{{ chatsStore.selectedChat?.name }}</p>
        <p v-if="chatsStore.selectedChat?.inviteFrom != null" id="invitedByLabel">
          Invite from: <br />@{{ chatsStore.selectedChat?.inviteFrom }}
        </p>
      </div>

      <q-btn
        id="listButton"
        icon="group"
        color="black"
        size="lg"
        @click="chatsStore.chanelUserList = true"
        flat
        rounded
        dense
      />

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

    <div id="scroll-container" ref="scrollContainer" class="scroll q-pa-md">
      <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div
          id="chat-message-wrapper"
          v-for="message in chatsStore.selectedChat?.messages"
          :key="message.id"
        >
          <div id="avatar-status-wrapper">
            <q-chat-message
              :avatar="
                'https://ui-avatars.com/api/?name=' +
                message.sender.name[0] +
                '+' +
                message.sender.surname[0]
              "
              :name="'@' + message.sender.nickname"
              :text="[message.content]"
              :bg-color="message.isMentioned ? 'yellow-6' : ''"
              :sent="message.isMine"
            />
            <q-avatar
              v-if="!message.isMine"
              id="statusAvatar"
              :color="settingsStore.userStates.find(us => us.id === message.sender.stateId)?.color"
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
  margin-left: 15px;
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

#listButton {
  position: absolute;
  right: 65px;
}

#closeButton {
  position: absolute;
  right: 10px;
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
