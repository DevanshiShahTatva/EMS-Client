import React from 'react';
import { getSocket } from '@/utils/services/socket';
import { LogOut, XIcon, MessageSquareMoreIcon } from "lucide-react";
import { toast } from 'react-toastify';
import { IChatInfoSidebarProps } from './type';

const ChatInfoSidebar: React.FC<IChatInfoSidebarProps> = ({
  userId,
  openChatInfo,
  currentChatDetails,
  setOpenChatInfo,
  handleStartChat,
  setMyGroups,
  setActiveChatId
}) => {
  if (!currentChatDetails) return null;

  const leaveGroupChat = () => {
    const socket = getSocket();
    if (!socket) {
      return;
    }

    socket.emit("leave_group_chat", {
      groupId: currentChatDetails.id,
    });

    setMyGroups(prev => prev.filter(group => group.id !== currentChatDetails.id));
    setActiveChatId(null);
    setOpenChatInfo(false);
    toast.success("You have left the group chat!");
  };

  const totalMember = currentChatDetails.members.length;

  return (
    <div
      className={`
        flex md:flex-1 flex-col bg-white border-gray-200 shadow
        fixed md:relative inset-0 md:inset-auto z-50 md:z-auto
        transition-all duration-400 ease-in-out overflow-hidden
        bottom-0 md:bottom-auto
        right-0 md:right-auto
        mt-[70px] md:mt-0
        ${openChatInfo ?
          'w-full md:w-auto md:max-w-[300px] translate-y-0 md:translate-y-0' :
          'w-full md:max-w-0 md:translate-y-0 translate-y-full'
        }
      `}
    >
      <div className='p-2 pr-[3px] md:p-[14px] border-b flex justify-between items-center w-full'>
        <div className="font-bold text-lg">
          Group Info
        </div>
        <button
          onClick={() => setOpenChatInfo(false)}
          className='p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer'
        >
          <XIcon className="text-lg" />
        </button>
      </div>
      <div className='flex-1 h-full overflow-auto'>
        <div className='border-b border-b-gray-200 text-center pt-7 pb-7 flex flex-col items-center'>
          {currentChatDetails.image ? (
            <img
              alt="profile"
              src={currentChatDetails.image}
              className="w-30 h-30 rounded-full"
            />
          ) : (
            <div className="w-30 h-30 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-4xl">
              {currentChatDetails.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className='p-2 mt-3 text-lg font-semibold'>
            {currentChatDetails.name}
          </div>
          <div>
            <div className="mt-2 text-sm text-gray-500 ">{totalMember} Member{totalMember > 1 && "s"}</div>
          </div>
        </div>
        <div className="border-b border-b-gray-200 flex flex-col gap-4 p-4">
          <button
            onClick={leaveGroupChat}
            className="flex justify-start items-center font-semibold text-[16px] text-[#f44649] cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" /> Leave Group
          </button>
        </div>
        <div className="p-4">
          <div className="font-bold text-md mb-3">
            Members
          </div>
          <div className="space-y-3">
            {currentChatDetails.members.map((member, i) => (
              <div key={`${i + 1}`} className="flex items-center justify-between gap-3">
                <div className='flex gap-3 items-center'>
                  {member.avatar ?
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 min-w-10 rounded-full" />
                    :
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  }
                  <div className='font-bold'>{member.name}</div>
                </div>
                {member.id !== userId && (
                  <div className='text-purple-700 cursor-pointer'>
                    <MessageSquareMoreIcon onClick={() => handleStartChat(member.id)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoSidebar;