import { ReactNode } from 'react';
import { BanIcon, UserIcon, UsersIcon } from "lucide-react";
import { IChatListProps, IGroup, IPrivateChat } from './type';

const ChatList: React.FC<IChatListProps> = ({
  userId,
  myGroups,
  isLoading,
  myPrivateChats,
  activeChatId,
  chatType,
  setActiveChat,
  fetchChatList
}) => {

  const isGroup = chatType === 'group';
  const list = isGroup ? myGroups : myPrivateChats;

  const handleClick = (id: string) => {
    if (id !== activeChatId) {
      setActiveChat(id, isGroup ? "group" : "private");
    }
  };

  const getSenderName = (item: IPrivateChat | IGroup): string => {
    if (item.senderId === userId) return "You";
    if (item.lastMessageSender) return item.lastMessageSender;
    return "";
  };

  const renderLastMessage = (item: IPrivateChat | IGroup) => {
    if (!item.lastMessage && !item.senderId) return null;

    const senderName = getSenderName(item);
    return (
      <div className="p-[2px] flex text-xs text-gray-500">
        {senderName && (
          <span className="shrink-0 truncate max-w-[80px]">
            {senderName}
          </span>
        )}
        <span className='pl-1 pr-1'>:</span>
        {item.lastMessage ? (
          <span className="truncate flex-1">
            {item.lastMessage}
          </span>
        ) : (
          <span className="flex items-center gap-1 flex-1 italic truncate">
            <BanIcon size={13} />
            <span className='truncate pr-[2px]'>This message was deleted</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 font-bold text-lg border-b">Chats</div>
      {isLoading ? (
        <ListSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {list.map((item, i) => (
            <button
              key={`${i + 1}`}
              onClick={() => handleClick(item.id)}
              className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer ${activeChatId === item.id ? 'bg-gray-200' : ''}`}
            >
              <div className='flex items-center gap-2'>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 min-w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="min-w-10 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-center gap-2'>
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {item.lastMessageTime}
                    </div>
                  </div>
                  {renderLastMessage(item)}
                </div>
              </div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              {isGroup ? "No groups found" : "No private chats found"}
            </div>
          )}
        </div>
      )}
      <div className="flex border-t">
        <TabButton
          active={isGroup}
          icon={<UsersIcon />}
          label="Groups"
          onClick={() => fetchChatList('group')}
        />
        <TabButton
          active={!isGroup}
          icon={<UserIcon />}
          label="Private"
          onClick={() => fetchChatList('private')}
        />
      </div>
    </div>
  );
};

const TabButton = ({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center p-2 cursor-pointer ${active ? 'text-purple-500' : 'text-gray-500'}`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

const ListSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`${i + 1}`} className="w-full px-4 py-3 border-b border-gray-200 animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 min-w-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="w-10 h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;