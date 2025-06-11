import React, { useState } from 'react';
import { getSocket } from '@/utils/services/socket';
import { toast } from 'react-toastify';
import {
  ChevronLeftIcon, SearchIcon, XIcon, LogOut,
  MessageSquareMoreIcon, UserRoundPlusIcon, UserRoundMinusIcon
} from "lucide-react";
import { apiCall } from '@/utils/services/request';
import { IChatInfoSidebarProps } from './type';

const ChatInfoSidebar: React.FC<IChatInfoSidebarProps> = ({
  userId,
  isAdmin,
  openChatInfo,
  currentChatDetails,
  setOpenChatInfo,
  handleStartChat,
  setMyGroups,
  setActiveChatId
}) => {

  const [isUsersPopoverOpen, setIsUsersPopoverOpen] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [search, setSearch] = useState("");

  if (!currentChatDetails) return null;

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await apiCall({
        endPoint: "/dashboard/analytics/all-user-list",
        method: "GET",
      });
      if (response.data) {
        setUserList(response.data);
      }
    } catch (err) {
      console.log("Err:" + err);
    } finally {
      setLoading(false);
    }
  }

  const addMembersInGroup = async () => {
    setAddMemberLoading(true);
    try {
      const response = await apiCall({
        endPoint: "/chat/add-members/" + currentChatDetails.id,
        method: "POST",
        body: {
          members: selectedUsers,
        }
      });
      if (response.success) {
        setSelectedUsers([]);
        setIsUsersPopoverOpen(false);
      }
    } catch (err) {
      console.log("Err:" + err);
    } finally {
      setAddMemberLoading(false);
    }
  }

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

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      const response = await apiCall({
        endPoint: "/chat/remove-member/" + currentChatDetails.id,
        method: "POST",
        body: { memberId }
      });
      if (response.success) {
        toast.success("Member removed successfully!");
      }
    } catch (err) {
      console.log("Err:" + err);
    }
  }

  const renderAddMemberUI = () => {
    if (!isAdmin) return null;

    return (
      <div className="flex-1 h-full overflow-auto bg-white flex flex-col">
        <div className="flex items-center gap-2 mb-4 p-4 pb-0">
          <button
            onClick={() => {
              setIsUsersPopoverOpen(false);
              setSelectedUsers([]);
            }}
            className="text-gray-600 hover:text-black cursor-pointer"
          >
            <ChevronLeftIcon />
          </button>
          <h2 className="text-lg font-semibold">Users</h2>
        </div>
        <div className="p-4 pb-2 pt-1">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <SearchIcon />
            <input
              type="text"
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm pl-2"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {userList
                .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
                .map((user: any, i) => (
                  <button
                    key={`${i + 1}`}
                    onClick={() => handleUserSelect(user._id)}
                    className="w-full flex items-center justify-between pt-[10px] pb-[10px] pl-[16px] pr-[16px] cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {user.profileimage?.url ?
                        <img src={user.profileimage.url} alt={user.name} className="w-10 h-10 min-w-10 rounded-full" />
                        :
                        <div className="min-w-10 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      }
                      <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onClick={() => handleUserSelect(user._id)}
                      className="w-5 h-5 accent-purple-500 cursor-pointer"
                    />
                  </button>
                ))}
            </>
          )}
        </div>
        {!loading && (
          <div className="p-4 pt-3">
            <button
              onClick={() => addMembersInGroup()}
              disabled={selectedUsers.length === 0}
              className="w-full p-2 text-sm rounded-md bg-blue-500 cursor-pointer disabled:cursor-not-allowed  disabled:bg-gray-200 text-white disabled:text-gray-500"
            >
              {addMemberLoading ? "Adding..." : "Add Members"}
            </button>
          </div>
        )}
      </div>
    );
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
      {!isUsersPopoverOpen ? (
        <>
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
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsUsersPopoverOpen(true);
                    fetchUserList();
                  }}
                  className="flex justify-start items-center font-semibold text-[16px] cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <UserRoundPlusIcon className="mr-2 h-5 w-5" />
                  Add Members
                </button>
              )}
              <button
                onClick={leaveGroupChat}
                className="flex justify-start items-center font-semibold text-[16px] text-[#f44649] hover:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-5 w-5" /> Leave Group
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
                      <div className='flex gap-3'>
                        {isAdmin && (
                          <div className='text-[#f44649] hover:text-red-600 cursor-pointer'>
                            <UserRoundMinusIcon onClick={() => removeMember(member.id)} />
                          </div>
                        )}
                        <div className='text-blue-500 hover:text-blue-700 cursor-pointer'>
                          <MessageSquareMoreIcon onClick={() => handleStartChat(member.id)} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {renderAddMemberUI()}
        </>
      )}
    </div>
  );
};

export default ChatInfoSidebar;