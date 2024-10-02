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

export interface Status {
  color?: string;
  title?: string;
  onClickEvent?: () => void;
}

interface Sender {
  id: number;
  name: string;
  surname: string;
  status: number;
}

export interface Message {
  id: number;
  content: string;
  sender: Sender;
}

export interface ChatRoom {
  id: number;
  name: string;
  isPrivate?: boolean;
  inviteFrom: string | null;
  messages: Message[];
}

export interface ChatRoomInvitation extends ChatRoom {

}
