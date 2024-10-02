export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  status: number;
  notifyMentionsOnly: boolean;
}
