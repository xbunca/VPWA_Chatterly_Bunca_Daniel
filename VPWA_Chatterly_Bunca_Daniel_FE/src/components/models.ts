export interface AppSettings {
  userStates: UserState[];
}

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
  stateId: number;
}

export interface Message {
  id: number;
  content: string;
  sender: Sender;
}

export interface ChatRoomInvitation {
  id: number;
  name: string;
  private: boolean;
  inviteFrom: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  private: boolean;
  isOwner: boolean;
  inviteFrom: string | null;
  users: Sender[];
  messages: Message[];
}
