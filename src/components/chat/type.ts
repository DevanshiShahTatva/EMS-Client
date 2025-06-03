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

export interface IGroup {
  id: string;
  name: string;
  image?: string;
  senderId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
  members: IMember[];
}

export interface IPrivateChat {
  id: string;
  name: string;
  image?: string;
  senderId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}

export interface IChatHeaderProps {
  isGroup: boolean;
  currentChatDetails: IGroup | IPrivateChat;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IChatListProps {
  userId: string | null;
  myGroups: IGroup[];
  myPrivateChats: IPrivateChat[];
  setActiveChat: (id: string, type: 'group' | 'private') => void;
  chatType: 'group' | 'private';
  setChatType: (type: 'group' | 'private') => void;
  activeChatId: string | null;
}

export interface IChatInfoSidebarProps {
  openChatInfo: boolean;
  userId: string | null;
  currentChatDetails: IGroup;
  setMyGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  handleStartChat: (memberId: string) => Promise<void>;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IGroupedMessages {
  [dateKey: string]: IMessage[];
}

export interface IChatWindowProps {
  userId: string | null;
  activeMenuId: string | null;
  setActiveMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
  editOrDeleteMessage: (status: 'deleted', messageId: string, newContent?: string) => void;
  chatApiEndpoint: string;
  chatId: string;
  isGroup: boolean;
  isScrollBottom: boolean;
  setIsScrollBottom: React.Dispatch<React.SetStateAction<boolean>>;
  groupedMessage: IGroupedMessages;
  groupMessagesByDate: any;
  setGroupedMessage: React.Dispatch<React.SetStateAction<IGroupedPrivateMessages | IGroupedMessages>>;
}

export interface IGroupChatContentProps {
  groupId: string;
  userId: string | null;
  currentGroupDetails: IGroup;
  setMyGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  getDateKey: (date: string | Date) => string;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IMessageInputProps {
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  setEditMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
  typingUsers: string[];
  editMessage: IMessage | null;
}

export interface IPrivateMessage {
  _id: string;
  chat: string;
  privateChat: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  status: 'edited' | 'deleted';
}

export interface IGroupedPrivateMessages {
  [dateKey: string]: IPrivateMessage[];
}

export interface IPrivateChatContentProps {
  chatId: string;
  userId: string | null;
  currentPrivateChatDetails: IPrivateChat;
  setMyPrivateChats: React.Dispatch<React.SetStateAction<IPrivateChat[]>>;
  getDateKey: (date: string | Date) => string;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface IChat {
  id: string;
  sender: IMember;
  receiver: IMember;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}