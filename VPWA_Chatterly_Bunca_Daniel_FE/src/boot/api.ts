import { useUserStore } from 'stores/userStore';
import { AppSettings, ChatRoom, ChatRoomInvitation } from 'components/models';
import { io } from 'socket.io-client';
import { useChatsStore } from 'stores/chatsStore';

const apiIp = 'http://localhost:3333/api/';
const socket = io('http://localhost:3333');

const userStore = useUserStore()

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | null;
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

  try {
    const response = await fetch(`${apiIp}${apiFunction}`, config);
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

export async function getChatRoomInvitations(): Promise<ChatRoomInvitation[]> {
  interface ChatRoomInvitationListItemResponse {
    id: number;
    name: string;
    private: boolean;
    from: string;
  }

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

// SOCKET

const chatStore = useChatsStore()

export async function authenticateSocket() {
  socket.emit('authenticate', {
    accessToken: userStore.accessToken,
  })
}

interface MessageReceived {
  chatRoomId: number;
  message: {
    id: number;
    content: string;
    isMine: boolean;
    sender: {
      name: string;
      surname: string;
      nickname: string;
      stateId: number;
    }
  }
}
socket.on('newMessage', async (data) => {
  const message: MessageReceived = JSON.parse(JSON.stringify(data))
  const chatRoom = chatStore.chatRooms.find(chatRoom => chatRoom.id === message.chatRoomId)
  chatRoom?.messages.push({
    id: message.message.id,
    content: message.message.content,
    isMine: message.message.isMine,
    sender: {
      name: message.message.sender.name,
      surname: message.message.sender.surname,
      nickname: message.message.sender.nickname,
      stateId: message.message.sender.stateId,
    },
  })
})

export async function sendMessage(chatId: number, message: string) {
  socket.emit('newMessage', {
    accessToken: userStore.accessToken,
    chatRoomId: chatId,
    content: message,
  })
}
