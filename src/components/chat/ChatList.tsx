import { ReactNode } from 'react';
import { BanIcon, UserIcon, UsersIcon } from "lucide-react";
import { IChatListProps, IGroup, IPrivateChat } from './type';

const ChatList: React.FC<IChatListProps> = ({
  userId,
  myGroups,
  myPrivateChats,
  activeChatId,
  chatType,
  setActiveChat,
  setChatType
}) => {

  const isGroup = chatType === 'group';
  const list = isGroup ? myGroups : myPrivateChats;

  const handleClick = (id: string) => {
    if (id !== activeChatId) {
      setActiveChat(id, isGroup ? "group" : "private");
    }
  }

  const getSenderName = (item: IPrivateChat | IGroup): string => {
    if (item.senderId === userId) return "You :";
    if (item.lastMessageSender) return item.lastMessageSender + " :";
    return "";
  };

  const renderLastMessage = (item: IPrivateChat | IGroup) => {
    if (!item.lastMessage && item.status !== "deleted") return null;

    const senderName = getSenderName(item);
    return (
      <div className="flex gap-2 text-xs text-gray-500 truncate">
        <span>{senderName}</span>
        {item.lastMessage ? (
          <span>{item.lastMessage}</span>
        ) : (
          <span className="flex items-center gap-1 italic">
            <BanIcon size={13} /> This message was deleted
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 font-bold text-lg border-b">Chats</div>
      <div className="flex-1 overflow-y-auto">
        {list.map((item, i: number) => (
          <button
            key={`${i + 1}`}
            onClick={() => handleClick(item.id)}
            className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer ${activeChatId === item.id ? 'bg-gray-200' : ''}`}
          >
            <div className='flex items-center gap-2'>
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-10 h-10 min-w-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className='flex justify-between w-full'>
                <div>
                  <div className="font-medium">{item.name}</div>
                  {renderLastMessage(item)}
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{item.lastMessageTime}</div>
              </div>
            </div>
          </button>
        ))}
        {list.length == 0 && (
          <div>
            <div className="text-center text-gray-500 p-4">
              {isGroup ? "No groups found" : "No private chats found"}
            </div>
          </div>
        )}
      </div>
      <div className="flex border-t">
        <TabButton
          active={!isGroup}
          icon={<UserIcon />}
          label="Private"
          onClick={() => setChatType('private')}
        />
        <TabButton
          active={isGroup}
          icon={<UsersIcon />}
          label="Groups"
          onClick={() => setChatType('group')}
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

export default ChatList;