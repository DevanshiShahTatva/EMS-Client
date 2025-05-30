export interface IMessage {
  createdAt: string;
  content: string;
  sender: {
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
