import { ReactNode } from 'react';
import { UserIcon, UsersIcon } from "lucide-react";
import { IChatListProps } from './type';

const ChatList: React.FC<IChatListProps> = ({
  userId,
  myGroups,
  myPrivateChats,
  activeChatId,
  chatType,
  setActiveChat,
  setChatType
}) => {

  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 font-bold text-lg border-b">Chats</div>
      <div className="flex-1 overflow-y-auto">
        {chatType === 'group' && (
          myGroups.map((group, i: number) => (
            <button
              key={`${i + 1}`}
              onClick={() => setActiveChat(group.id, "group")}
              className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer ${activeChatId === group.id ? 'bg-gray-200' : ''}`}
            >
              <div className='flex items-center gap-2'>
                {group.icon ? (
                  <img src={group.icon} alt={group.name} className="w-10 h-10 min-w-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className='flex justify-between w-full'>
                  <div>
                    <div className="font-medium">{group.name}</div>
                    {group.lastMessage && (
                      <div className="text-xs text-gray-500 truncate">
                        <span>{group.senderId === userId ? "You" : group.lastMessageSender} : </span>
                        {group.lastMessage}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">{group.lastMessageTime}</div>
                </div>
              </div>
            </button>
          ))
        )}
        {chatType === 'private' && (
          myPrivateChats.map((chat: any) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id, "private")}
              className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer ${activeChatId === chat.id ? 'bg-gray-200' : ''}`}
            >
              <div className='flex items-center gap-2'>
                {chat.icon ? (
                  <img src={chat.icon} alt={chat.name} className="w-10 h-10 min-w-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {chat.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className='flex justify-between w-full'>
                  <div>
                    <div className="font-medium">{chat.name}</div>
                    {chat.lastMessage && (
                      <div className="text-xs text-gray-500 truncate">
                        <span>{chat.senderId === userId ? "You" : chat.lastMessageSender} : </span>
                        {chat.lastMessage}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">{chat.lastMessageTime}</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="flex border-t">
        <TabButton
          active={chatType === 'private'}
          icon={<UserIcon />}
          label="Private"
          onClick={() => setChatType('private')}
        />
        <TabButton
          active={chatType === 'group'}
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