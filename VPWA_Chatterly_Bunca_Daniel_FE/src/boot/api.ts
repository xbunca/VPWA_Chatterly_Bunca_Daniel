import { useUserStore } from 'stores/userStore';

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
    console.log(error)
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
export async function accountDetail() : Promise<AccountResponse> {
  try {
    return await fetchApi('account', true, {
      method: 'GET',
    }) as AccountResponse
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '-1')
  }
}
