import { useUserStore } from 'stores/userStore';
import { AppSettings, ChatRoom, ChatRoomInvitation, Message } from 'components/models';
import { io } from 'socket.io-client';
import { useChatsStore } from 'stores/chatsStore';

const serverProtocol = 'http://'
const serverIp = 'localhost'
const serverPort = '3333'

const apiIp = `${serverProtocol}${serverIp}:${serverPort}/api/`;
const socket = io(`${serverProtocol}${serverIp}:${serverPort}`);

const userStore = useUserStore()

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | null;
  query?: Record<string, string | number | boolean>;
}

interface HttpError {
  message: string;
}

async function fetchApi(apiFunction: string, authenticate: boolean, options: FetchOptions = {}): Promise<unknown> {
  const defaultHeaders: Record<string, string | null> = {
    'Content-Type': 'application/json',
    'Authorization': authenticate && userStore.accessToken ? `Bearer ${userStore.accessToken}` : null,
  };

  const headers = new Headers();

  Object.entries(defaultHeaders).forEach(([key, value]) => {
    if (value) {
      headers.append(key, value);
    }
  });

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const queryString = options.query
    ? '?' + new URLSearchParams(options.query as Record<string, string>).toString()
    : '';

  try {
    const response = await fetch(`${apiIp}${apiFunction}${queryString}`, config);
    if (!response.ok) {
      const httpError = await response.json() as HttpError;
      throw new Error(httpError.message);
    }
    return await response.json();
  } catch (error) {
    throw error
  }
}

export interface SettingsResponse {
  userStates: {
    id: number;
    name: string;
    color: string;
  }[]
}
export async function getSettings(): Promise<AppSettings> {

  try {
    const data = await fetchApi('settings', false, {
      method: 'GET',
    }) as SettingsResponse

    localStorage.setItem('settings', JSON.stringify(data))

    return {
      userStates: data.userStates.map(userStateData => {
        return {
          id: userStateData.id,
          name: userStateData.name,
          color: userStateData.color,
        }
      })
    }
  } catch (error) {
    throw error
  }
}

interface LoginResponse {
  access_token: string;
}

export async function login(username: string, password: string) {

  const body = {
    username: username,
    password: password,
  }

  try {
    const data = await fetchApi('auth/login', false, {
      method: 'POST',
      body: body,
    }) as LoginResponse
    const accessToken = data.access_token
    localStorage.setItem('accessToken', accessToken)
    userStore.accessToken = accessToken
  } catch (error) {
    throw error
  }
}

export async function register(name: string, surname: string, nickname: string, email: string,password: string) {
  const body = {
    name: name,
    surname: surname,
    nickname: nickname,
    email: email,
    password: password,
  }

  try {
    const data = await fetchApi('auth/register', false, {
      method: 'POST',
      body: body,
    }) as LoginResponse
    const accessToken = data.access_token
    localStorage.setItem('accessToken', accessToken)
    userStore.accessToken = accessToken
  } catch (error) {
    throw error
  }
}

interface AccountResponse {
  name: string;
  surname: string;
  nickname: string;
  notifyMentionsOnly: boolean;
  stateId: number;
}
export async function getAccountDetail() : Promise<AccountResponse> {
  try {
    return await fetchApi('account', true, {
      method: 'GET',
    }) as AccountResponse
  } catch (error) {
    throw error
  }
}

export async function logoutUser()  {
  try {
    await fetchApi('auth/logout', true, {
      method: 'POST',
    })
    localStorage.removeItem('accessToken');
    userStore.accessToken = null;
  } catch (error) {
    throw error
  }
}

export async function updateUserState(stateId: number) : Promise<AccountResponse> {
  const body = {
    stateId: stateId,
  }

  try {
    return await fetchApi('account', true, {
      method: 'PATCH',
      body: body,
    }) as AccountResponse
  } catch (error) {
    throw error
  }
}

export async function updateNotifyMentionsOnly(notifyMentionsOnly: boolean) : Promise<AccountResponse> {
  const body = {
    notifyMentionsOnly: notifyMentionsOnly,
  }

  try {
    return await fetchApi('account', true, {
      method: 'PATCH',
      body: body,
    }) as AccountResponse
  } catch (error) {
    throw error
  }
}

export async function createChatRoom(name: string, isPrivate: boolean): Promise<ChatRoom> {
  const body = {
    name: name,
    private: isPrivate,
  }

  try {
    const data = await fetchApi('chatRoom', true, {
      method: 'POST',
      body: body,
    }) as ChatRoomListItemResponse

    return {
      id: data.id,
      name: data.name,
      private: data.private,
      isOwner: data.isOwner,
      inviteFrom: data.inviteFrom,
      users: [],
      messages: [],
    }
  } catch (error) {
    throw error
  }
}

export async function joinChatRoom(name: string): Promise<ChatRoom> {
  try {
    const data = await fetchApi(`chatRoom/${ name }`, true, {
      method: 'POST',
    }) as ChatRoomListItemResponse

    return {
      id: data.id,
      name: data.name,
      private: data.private,
      isOwner: data.isOwner,
      inviteFrom: data.inviteFrom,
      users: [],
      messages: [],
    }
  } catch (error) {
    throw error
  }
}

interface ChatRoomListItemResponse {
  id: number;
  name: string;
  private: boolean;
  isOwner: boolean;
  inviteFrom: string | null;
}

export async function getChatRooms(): Promise<ChatRoom[]> {

  try {
    const data = await fetchApi('chatRoom', true, {
      method: 'GET',
    }) as ChatRoomListItemResponse[]
    const chatRooms: ChatRoom[] = []
    for (const chatRoom of data) {
      chatRooms.push({
        id: chatRoom.id,
        name: chatRoom.name,
        private: chatRoom.private,
        isOwner: chatRoom.isOwner,
        inviteFrom: chatRoom.inviteFrom,
        users: [],
        messages: [],
      })
    }
    return chatRooms
  } catch (error) {
    throw error
  }
}

interface ChatRoomInvitationListItemResponse {
  id: number;
  name: string;
  private: boolean;
  from: string;
}
export async function getChatRoomInvitations(): Promise<ChatRoomInvitation[]> {

  try {
    const data = await fetchApi('chatRoom/invite', true, {
      method: 'GET',
    }) as ChatRoomInvitationListItemResponse[]
    const chatRoomInvitations: ChatRoomInvitation[] = []
    for (const invitation of data) {
      chatRoomInvitations.push({
        id: invitation.id,
        name: invitation.name,
        private: invitation.private,
        inviteFrom: invitation.from,
      })
    }
    return chatRoomInvitations
  } catch (error) {
    throw error
  }
}

export async function inviteToChatRoom(chatId: number, nickname: string) {
  try {
    await fetchApi(`chatRoom/${ chatId }/invite/${ nickname }`, true, {
      method: 'POST',
    })
  } catch (error) {
    throw error
  }
}

export async function respondToChatRoomInvitation(invitationId: number, accept: boolean) {
  const body = {
    accept: accept,
  }

  try {
    try {
      const data = await fetchApi(`chatRoom/invite/${ invitationId }`, true, {
        method: 'PATCH',
        body: body,
      }) as ChatRoomListItemResponse

      const chatRoom: ChatRoom = {
        id: data.id,
        name: data.name,
        private: data.private,
        isOwner: data.isOwner,
        inviteFrom: data.inviteFrom,
        messages: [],
        users: [],
      }
      return chatRoom
    } catch (e) {
      return null
    }
  } catch (error) {
    throw error
  }
}

export async function leaveChatRoom(chatId: number) {
  try {
    await fetchApi(`chatRoom/${ chatId }/leave`, true, {
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

export async function getChatRoomDetails(chatId: number): Promise<ChatRoom> {
  interface ChatRoomDetails extends ChatRoomListItemResponse {
    users: {
      name: string;
      surname: string;
      nickname: string;
      stateId: number;
    }[]
  }

  try {
    const data = await fetchApi(`chatRoom/${ chatId }`, true, {}) as ChatRoomDetails
    return {
      id: data.id,
      name: data.name,
      private: data.private,
      isOwner: data.isOwner,
      inviteFrom: data.inviteFrom,
      users: data.users.map(user => {
        return {
          name: user.name,
          surname: user.surname,
          nickname: user.nickname,
          stateId: user.stateId,
        }
      }),
      messages: []
    }
  } catch (error) {
    throw error
  }
}

export async function getChatRoomMessages(chatId: number, limit: number, lastMessageId: number | null): Promise<[number, Message[]]> {

  try {
    let query = {
      limit: limit,
    }
    if (lastMessageId !== null) {
      query = Object.assign({}, query, { lastMessageId: lastMessageId })
    }
    const data = await fetchApi(`chatRoom/${ chatId }/message`, true, {
      query: query,
    }) as MessageData[]

    return [chatId, data.map((md) => {
      return {
        id: md.id,
        content: md.content,
        isMine: md.isMine,
        isMentioned: md.isMentioned,
        sender: {
          name: md.sender.name,
          surname: md.sender.surname,
          nickname: md.sender.nickname,
          stateId: md.sender.stateId,
        },
      }
    })]
  } catch (error) {
    throw error
  }
}

export async function kickUser(chatId: number, nickname: string): Promise<void> {
  await fetchApi(`chatRoom/${chatId}/kick/${nickname}`, true, { method: 'POST' });
}

export async function revokeUser(chatId: number, nickname: string): Promise<void> {
  const response = await fetchApi(`chatRoom/${chatId}/revoke/${nickname}`, true, { method: 'POST' }) as Response;
  console.log(response)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred while revoking the user');
  }
}


// SOCKET

const chatStore = useChatsStore()

export async function authenticateSocket() {
  socket.emit('authenticate', {
    accessToken: userStore.accessToken,
  })
}

interface MessageData {
  id: number;
  content: string;
  isMine: boolean;
  isMentioned: boolean;
  sender: {
    name: string;
    surname: string;
    nickname: string;
    stateId: number;
  }
}

interface MessageReceived {
  chatRoomId: number;
  notify: boolean;
  message: MessageData;
}
socket.on('newMessage', async (data: MessageReceived) => {
  const message = data
  const chatRoom = chatStore.chatRooms.find(chatRoom => chatRoom.id === message.chatRoomId)
  chatRoom?.messages.push({
    id: message.message.id,
    content: message.message.content,
    isMine: message.message.isMine,
    isMentioned: message.message.isMentioned,
    sender: {
      name: message.message.sender.name,
      surname: message.message.sender.surname,
      nickname: message.message.sender.nickname,
      stateId: message.message.sender.stateId,
    },
  })

  if (!message.notify) {
    return
  }

  if (Notification.permission !== 'granted') {
    return
  }

  if (chatRoom?.id === chatStore.selectedChat?.id && document.visibilityState === 'visible') {
    return
  }

  new Notification(`${chatRoom?.name}: ${message.message.sender.name + message.message.sender.surname}`, {
    body: message.message.content,
    icon: 'src/assets/logo.png',
  })
})

socket.on('chatRoomInvitation', (data: ChatRoomInvitationListItemResponse) => {
  const invitation = data
  chatStore.invitations.push({
    id: invitation.id,
    name: invitation.name,
    private: invitation.private,
    inviteFrom: invitation.from,
  })
})

interface UserJoinedChatRoom {
  chatRoomId: number;
  user: {
    name: string;
    surname: string;
    nickname: string;
    stateId: number;
  }
}
socket.on('userJoinedChat', (data: UserJoinedChatRoom) => {
  const userJoinedChatRoom = data
  const chatRoom = chatStore.chatRooms.find(chatRoom => chatRoom.id === userJoinedChatRoom.chatRoomId)
  if (chatRoom !== undefined) {
    chatRoom.users.push({
      name: userJoinedChatRoom.user.name,
      surname: userJoinedChatRoom.user.surname,
      nickname: userJoinedChatRoom.user.nickname,
      stateId: userJoinedChatRoom.user.stateId,
    })
  }
})

interface UserLeftChatRoom {
  chatRoomId: number;
  nickname: string;
}
socket.on('userLeftChat', (data: UserLeftChatRoom) => {
  const userLeftChatRoom = data
  const chatRoom = chatStore.chatRooms.find(chatRoom => chatRoom.id === userLeftChatRoom.chatRoomId)
  if (chatRoom !== undefined) {
    const userIndex = chatRoom.users.findIndex(user => user.nickname === userLeftChatRoom.nickname)
    if (userIndex !== -1) {
      chatRoom.users.splice(userIndex, 1)
    }
  }
})

interface ChatRoomDeleted {
  chatRoomId: number;
}
socket.on('chatRoomDeleted', (data: ChatRoomDeleted) => {
  const chatRoomDeleted = data
  const chatRoomIndex = chatStore.chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomDeleted.chatRoomId)
  if (chatRoomIndex !== -1) {
    chatStore.chatRooms.splice(chatRoomIndex, 1)
  }
})

export async function sendMessage(chatId: number, message: string) {
  socket.emit('newMessage', {
    accessToken: userStore.accessToken,
    chatRoomId: chatId,
    content: message,
  })
}

interface UserStateChanged {
  userNickname: string;
  chatRoomId: number;
  stateId: number;
}
socket.on('userStateChanged', (data: UserStateChanged) => {
  const chatRoom = chatStore.chatRooms.find(chatRoom => chatRoom.id === data.chatRoomId)
  if (chatRoom !== undefined) {
    const user = chatRoom.users.find(user => user.nickname === data.userNickname)
    if (user !== undefined) {
      user.stateId = data.stateId
    }
    const chatMessages = chatRoom.messages.filter(message => message.sender.nickname === data.userNickname)
    for (const message of chatMessages) {
      message.sender.stateId = data.stateId
    }
  }
})
