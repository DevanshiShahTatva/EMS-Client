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
  members: IMember[];
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
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

export interface IGroupedMessages {
  [dateKey: string]: IMessage[];
}

export interface IChatHeaderProps {
  isGroup: boolean;
  totalMember?: number;
  currentChatDetails: IGroup | IPrivateChat;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IChatListProps {
  userId: string | null;
  isLoading: boolean;
  myGroups: IGroup[];
  activeChatId: string | null;
  chatType: 'group' | 'private';
  myPrivateChats: IPrivateChat[];
  fetchChatList: (type: 'group' | 'private') => void;
  setActiveChat: (id: string, type: 'group' | 'private') => void;
}

export interface IChatInfoSidebarProps {
  openChatInfo: boolean;
  userId: string | null;
  currentChatDetails: IGroup;
  handleStartChat: (memberId: string) => Promise<void>;
  setMyGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IChatWindowProps {
  chatId: string;
  isGroup: boolean;
  userId: string | null;
  isScrollBottom: boolean;
  chatApiEndpoint: string;
  groupMessagesByDate: any;
  activeMenuId: string | null;
  groupedMessage: IGroupedMessages;
  setIsScrollBottom: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
  editOrDeleteMessage: (status: 'deleted', messageId: string, newContent?: string) => void;
  setGroupedMessage: React.Dispatch<React.SetStateAction<IGroupedPrivateMessages | IGroupedMessages>>;
}

export interface IGroupChatContentProps {
  groupId: string;
  userId: string | null;
  currentGroupDetails: IGroup;
  setMyGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IMessageInputProps {
  typingUsers: string[];
  editMessage: IMessage | null;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  setEditMessage: React.Dispatch<React.SetStateAction<IMessage | null>>;
}

export interface IPrivateChatContentProps {
  chatId: string;
  userId: string | null;
  currentPrivateChatDetails: IPrivateChat;
  setMyPrivateChats: React.Dispatch<React.SetStateAction<IPrivateChat[]>>;
  setOpenChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
}