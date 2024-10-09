import { defineStore } from 'pinia';
import { ChatRoom, ChatRoomInvitation } from 'components/models';


interface ChatsState {
  invitations: ChatRoomInvitation[];
  chats: ChatRoom[];
  selectedChat: ChatRoom | null;
}

export const useChatsStore = defineStore('chats',{
  state: (): ChatsState => ({
    invitations: [],
    chats: [],
    selectedChat: null
  })
})

const chatsStore = useChatsStore()

const adjectives = [
  'Nebula', 'Star', 'Cosmic', 'Galactic', 'Quantum', 'Astro', 'Pulsar', 'Photon', 'Nova', 'Quasar', 'Celestial', 'Stellar'
];

const nouns = [
  'Whisper', 'Dust', 'Voyage', 'Pulse', 'Echo', 'Flare', 'Wave', 'Comms', 'Currents', 'Beam', 'Lounge', 'Chatter'
];

for (let i = 0; i < 3; i++) {
  chatsStore.invitations.push({
    id: i,
    name: adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)],
    isPrivate: Math.random() > 0.5,
    inviteFrom: 'nickname',
    messages: []
  });
}

for (let i = 3; i < 18; i++) {
  chatsStore.chats.push({
    id: i,
    name: adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)],
    isPrivate: Math.random() > 0.5,
    inviteFrom: Math.random() > 0.5 ? 'nickname' : null,
    messages: []
  });
}
