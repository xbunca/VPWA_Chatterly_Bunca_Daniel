import { useUserStore } from 'stores/userStore';
import { ChatRoom, ChatRoomInvitation } from 'components/models';

const apiIp = 'http://localhost:3333/api/';

const userStore = useUserStore()

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | null;
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
      throw new Error(`${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1');
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
    let message = 'Something went wrong'
    switch (error instanceof Error ? error.message : '-1') {
      case '401':
        message = 'Not authorized'
        break
      case '404':
        message = 'Not found'
        break
    }
    throw new Error(message)
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
    throw new Error(error instanceof Error ? error.message : '-1')
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
    throw new Error(error instanceof Error ? error.message : '-1')
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
    throw new Error(error instanceof Error ? error.message : '-1')
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
    throw new Error(error instanceof Error ? error.message : '-1')
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
      inviteFrom: null,
      users: [],
      messages: [],
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
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
      inviteFrom: null,
      users: [],
      messages: [],
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
  }
}

interface ChatRoomListItemResponse {
  id: number;
  name: string;
  private: boolean;
  isOwner: boolean;
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
        inviteFrom: null,
        users: [],
        messages: [],
      })
    }
    return chatRooms
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
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
    throw new Error(error instanceof Error ? error.message : '-1')
  }
}

export async function inviteToChatRoom(chatId: number, nickname: string) {
  try {
    await fetchApi(`chatRoom/${ chatId }/invite/${ nickname }`, true, {
      method: 'POST',
    })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
  }
}

export async function respondToChatRoomInvitation(invitationId: number, accept: boolean) {
  const body = {
    accept: accept,
  }

  try {
    await fetchApi(`chatRoom/invite/${ invitationId }`, true, {
      method: 'PATCH',
      body: body,
    })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
  }
}
