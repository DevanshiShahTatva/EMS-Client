export interface IMessage {
  _id: string;
  createdAt: string;
  content: string;
  status?: 'edited' | 'deleted';
  isSystemMessage?: boolean;
  systemMessageType?: string;
  systemMessageData?: {
    userId: string;
  };
  sender?: {
    _id: string;
    name: string;
    profileimage?: {
      url?: string;
    }
  }
}

export interface IMember {
  id: string;
  name: string;
  avatar: string;
}

export interface IGroup {
  id: string;
  name: string;
  icon?: string;
  senderId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
  members: IMember[];
}
