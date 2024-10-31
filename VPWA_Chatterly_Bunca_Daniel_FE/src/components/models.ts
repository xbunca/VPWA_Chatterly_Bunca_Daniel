export interface User {
  name: string;
  surname: string;
  nickname: string;
  stateId: number;
  notifyMentionsOnly: boolean;
}

export interface UserState {
  id: number;
  name: string;
  color: string;
}

export interface Sender {
  name: string;
  surname: string;
  nickname: string;
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
  isPrivate: boolean;
  inviteFrom: string | null;
  users: Sender[];
  messages: Message[];
}

export interface ChatRoomInvitation extends ChatRoom {

}
