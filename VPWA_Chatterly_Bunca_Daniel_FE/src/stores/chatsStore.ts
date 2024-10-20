import { defineStore } from 'pinia';
import { ChatRoom, ChatRoomInvitation, Sender, User } from 'components/models';


interface ChatsState {
  invitations: ChatRoomInvitation[];
  chats: ChatRoom[];
  chatListToggle: boolean;
  chanelUserList: boolean;
  selectedChat: ChatRoom | null;
}

export const useChatsStore = defineStore('chats',{
  state: (): ChatsState => ({
    invitations: [],
    chats: [],
    chatListToggle: false,
    chanelUserList: false,
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

const firstNames: string[] = [
  'John', 'Jane', 'Alice', 'Bob', 'Emily',
  'Michael', 'Sarah', 'David', 'Emma', 'Chris',
  'Olivia', 'James', 'Sophia', 'Liam', 'Isabella',
  'William', 'Ava', 'Ethan', 'Mia', 'Alexander'
];

const lastNames: string[] = [
  'Doe', 'Smith', 'Johnson', 'Brown', 'Davis',
  'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark'
];

const messages: string[] = [
  // Short Messages
  'Hi there!',
  'Good job!',
  'All set!',
  'See you soon!',
  'Try again!',
  'Welcome!',
  'Done!',
  'Error!',

  // Mid-Length Messages
  'Your changes have been saved.',
  'We received your request.',
  'Check your inbox for details.',
  'Your profile has been updated successfully.',
  'You’ve been logged out automatically.',
  'Please complete all required fields.',
  'Action required: Please @nickname review your input.',
  'We are processing your request.',

  // Longer Messages
  'Thank you for submitting your feedback! We value your opinion and will take it into consideration.',
  'Your account is now active. You can start exploring the platform and customizing your experience.',
  'We’re sorry, but there was an issue with your request. Please try again or contact support if the issue persists.',
  'Congratulations @nickname ! Your transaction was successful, and we’ve sent you a confirmation email with all the details.',
  'Your session has expired due to inactivity. Please log in again to continue where you left off.',
  'Thank you for joining our community! We’re excited to have you on board and hope you enjoy your experience.'
];

function generateSenders(count: number): Sender[] {
  const senders: Sender[] = []
  for (let i = 0; i < count; i++) {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)]
    const surname = lastNames[Math.floor(Math.random() * lastNames.length)]
    senders.push({
      id: Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
      name: name,
      surname: surname,
      nickname: name.toLowerCase() + '.' + surname.toLowerCase()[0],
      status: Math.floor(Math.random() * 3)
    })
  }
  return senders
}

export function generateMessages(chat: ChatRoom, user: User, count: number)  {
  const userSender: Sender = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    status: user.status
  }
  for (let i = 0; i < count; i++) {
    const sender = Math.random() > 0.2 ? chat.users[Math.floor(Math.random() * chat.users.length)] : userSender
    chat.messages.unshift({
      id: Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
      content: messages[Math.floor(Math.random() * messages.length)],
      sender: sender
    })
  }
}

for (let i = 0; i < 3; i++) {
  const users = generateSenders(Math.floor(Math.random() * (10 - 2 + 1)) + 2);
  const owner = users[Math.floor(Math.random() * users.length)];

  chatsStore.invitations.push({
    id: i,
    name: adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)],
    ownerId: owner.id,
    isPrivate: Math.random() > 0.5,
    inviteFrom: 'nickname',
    users: users,
    messages: []
  });
}

for (let i = 3; i < 18; i++) {
  const users = generateSenders(Math.floor(Math.random() * (10 - 2 + 1)) + 2);
  const owner = users[Math.floor(Math.random() * users.length)];

  chatsStore.chats.push({
    id: i,
    name: adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)],
    ownerId: owner.id,
    isPrivate: Math.random() > 0.5,
    inviteFrom: Math.random() > 0.5 ? 'nickname' : null,
    users: users,
    messages: []
  });
}

