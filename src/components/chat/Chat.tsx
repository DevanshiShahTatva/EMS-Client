"use client";

import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  Trash2Icon, PencilIcon, LogOut, BanIcon, UserIcon, UsersIcon, SmileIcon,
  SendHorizonalIcon, InfoIcon, EllipsisVerticalIcon, XIcon, MessageSquareTextIcon
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import { connectSocket, disconnectSocket, getSocket } from './socket';
import { apiCall } from '@/utils/services/request';
import { IGroup, IMessage } from './type';

const Chat = () => {
  const [userId, setUserId] = useState<null | string>(null);
  const [activeOption, setActiveOption] = useState<string>("groups");
  const [groupedMessage, setGroupedMessage] = useState<Record<string, IMessage[]>>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const typingTimeoutRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!activeGroup || !socket) return;

    socket.emit("join_group_chat", { groupId: activeGroup });

    socket.on("initial_messages", (data) => {
      setGroupedMessage(groupMessagesByDate(data.messages));
      setIsScrollBottom(true);
    });

    socket.on('group_member_added', ({ groupId, newMember }) => {
      setMyGroups(prev => prev.map((group) =>
        group.id === groupId
          ? {
            ...group,
            members: [
              ...group.members,
              {
                id: newMember.id,
                name: newMember.name,
                avatar: newMember.avatar
              }
            ]
          }
          : group
      ));
    });

    socket.on('group_member_removed', ({ groupId, removedMemberId }) => {
      if (removedMemberId === userId) {
        setActiveGroup(null);
        setGroupedMessage({});
        setOpenGroupInfo(false);
        setHasMoreMessages(false);
        setLoadingOlderMessages(false);
        setMyGroups(prev => prev.filter(group => group.id !== groupId));
        toast.success("You removed from the group chat!");
      } else {
        setMyGroups(prev => prev.map((group) =>
          group.id === groupId
            ? {
              ...group,
              members: group.members.filter(member => member.id !== removedMemberId)
            }
            : group
        ));
      }
    });

    socket.on("new_group_message", (message) => {
      if (message.group === activeGroup) {
        setGroupedMessage(prev => addMessageToGroup(message, prev));
        setMyGroups(prev => prev.map((group) =>
          group.id === message.group
            ? {
              ...group,
              lastMessage: message.content,
              senderId: message.sender?._id ?? "",
              lastMessageSender: message.sender?.name ?? "",
              lastMessageTime: moment(message.createdAt).format('hh:mm A')
            }
            : group
        ));
      }
    });

    socket.on("new_edited_or_deleted_message", ({ status, groupId, messageId, newMessage }) => {
      if (groupId === activeGroup) {
        setGroupedMessage(prev => {
          const newGroups = { ...prev };
          for (const dateKey in newGroups) {
            newGroups[dateKey] = newGroups[dateKey].map(msg =>
              msg._id === messageId ? { ...msg, status, content: newMessage } : msg
            );
          }
          return newGroups;
        });
      }
    });

    socket.on("message_edited_or_deleted_successfully", ({ status }) => {
      if (status === "edited") {
        setEditMessage(null);
        setNewMessage("");
      }
    });

    return () => {
      socket.off("initial_messages");
      socket.off("new_group_message");
      socket.off("group_member_added");
      socket.off("group_member_removed");
      socket.off("new_edited_message");
      socket.off("message_edited_successfully");
    };
  }, [activeGroup]);

  useEffect(() => {
    const socket = getSocket();
    if (!activeGroup || !socket) return;

    socket.on('user_typing', ({ user, groupId: typingGroupId }) => {
      if (typingGroupId === activeGroup && user._id !== userId) {
        setTypingUsers((prev) => [...new Set([...prev, user])]);
      }
    });

    socket.on('user_stopped_typing', ({ user, groupId: typingGroupId }) => {
      if (typingGroupId === activeGroup) {
        setTypingUsers((prev) => prev.filter((name) => name !== user));
      }
    });

    return () => {
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [activeGroup]);

  useEffect(() => {
    isScrollBottom && scrollToBottom();
  }, [groupedMessage, isScrollBottom]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMyGroup = async () => {
    try {
      const response = await apiCall({
        endPoint: '/chat/my-group',
        method: "GET",
        withToken: true,
      });
      if (response.data) {
        setMyGroups(response.data.map((group: any) => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
          members: group.members,
          senderId: group.senderId || null,
          lastMessage: group.lastMessage,
          lastMessageSender: group.lastMessageSender,
          lastMessageTime: group.lastMessage ? moment(group.lastMessageTime).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  const loadOlderMessages = async () => {
    if (loadingOlderMessages || !hasMoreMessages || Object.keys(groupedMessage).length === 0) return;
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (!messagesContainer) return;

    const scrollTopBefore = messagesContainer.scrollTop;
    const scrollHeightBefore = messagesContainer.scrollHeight;

    setLoadingOlderMessages(true);
    try {
      const oldestDateKey = Object.keys(groupedMessage)[0];
      const oldestMessage = groupedMessage[oldestDateKey][0];
      if (!oldestMessage) return;

      const response = await apiCall({
        endPoint: `/chat/messages/${activeGroup}?before=${oldestMessage.createdAt}`,
        method: "GET",
        withToken: true,
      });

      if (response.data?.length) {
        setGroupedMessage(prev => {
          const newGroups = groupMessagesByDate(response.data);
          const mergedGroups = { ...newGroups };
          for (const dateKey in prev) {
            if (mergedGroups[dateKey]) {
              mergedGroups[dateKey] = [...newGroups[dateKey], ...prev[dateKey]];
            } else {
              mergedGroups[dateKey] = prev[dateKey];
            }
          }
          return mergedGroups;
        });
        requestAnimationFrame(() => {
          if (messagesContainer) {
            const scrollHeightAfter = messagesContainer.scrollHeight;
            messagesContainer.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
          }
        });
        setHasMoreMessages(response.hasMore);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingOlderMessages(false);
    }
  };

  const scrollToBottom = () => {
    setIsScrollBottom(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop === 0 && hasMoreMessages) {
      loadOlderMessages();
    }
  };

  const groupMessagesByDate = (messages: IMessage[]) => {
    return messages.reduce<Record<string, IMessage[]>>((groups, message) => {
      const dateKey = getDateKey(message.createdAt);
      groups[dateKey] = groups[dateKey] || [];
      groups[dateKey].push(message);
      return groups;
    }, {});
  };

  const addMessageToGroup = (message: IMessage, existingGroups: Record<string, IMessage[]>) => {
    const dateKey = getDateKey(message.createdAt);
    return {
      ...existingGroups,
      [dateKey]: [...(existingGroups[dateKey] || []), message]
    };
  };

  const getDateKey = (date: string) => {
    const msgDate = moment(date);
    if (msgDate.isSame(moment(), 'day')) return 'Today';
    if (msgDate.isSame(moment().subtract(1, 'days'), 'day')) return 'Yesterday';
    return msgDate.format('D MMMM, YYYY');
  };

  const handleTyping = () => {
    const socket = getSocket();
    socket.emit('typing', { groupId: activeGroup });

    clearTimeout(typingTimeoutRef?.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { groupId: activeGroup });
    }, 1000);
  };

  const onInputChange = (value: string) => {
    setNewMessage(value);
    handleTyping();
  };

  const editOrDeleteMessage = async (status: 'edited' | 'deleted', messageId: string, newContent: string) => {
    const socket = getSocket();
    socket.emit("edit_or_delete_message", {
      status,
      messageId,
      newContent,
      groupId: activeGroup,
    });
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !activeGroup) return;

    if (editMessage) {
      editOrDeleteMessage('edited', editMessage._id, newMessage.trim());
    } else {
      const socket = getSocket();
      socket.emit("group_message", {
        groupId: activeGroup,
        content: newMessage.trim(),
      });
    }
    setNewMessage("");
  };

  const leaveGroupChat = async () => {
    if (!activeGroup) return;

    const socket = getSocket();
    socket.emit("leave_group_chat", {
      groupId: activeGroup,
    });
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-full flex bg-gray-100">
      <div className="w-1/3 max-w-xs bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg border-b">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {myGroups.map((group, i) => (
            <button
              key={`${i + 1}`}
              onClick={() => setActiveGroup(group.id)}
              className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer ${activeGroup === group.id ? 'bg-gray-200' : ''}`}
            >
              <div className='flex items-center gap-2'>
                {group.icon ? (
                  <img src={group.icon} alt={group.name} className="w-10 h-10 min-w-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium">{group.name}</div>
                  {group.lastMessage && (
                    <div className="text-xs text-gray-500 truncate">
                      <span>{group.senderId === userId ? "You" : group.lastMessageSender} : </span>
                      {group.lastMessage}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">{group.lastMessageTime}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-around border-t bg-white">
          <button
            onClick={() => {
              setActiveOption('user');
            }}
            className={`flex flex-col items-center p-3 w-1/2 text-gray-500 font-semibold cursor-pointer ${activeOption === "user" && "text-purple-500"}`}
          >
            <UserIcon />
            Users
          </button>
          <button
            onClick={() => {
              fetchMyGroup();
              setActiveOption('group');
            }}
            className={`flex flex-col items-center p-3 w-1/2 text-gray-500 font-semibold cursor-pointer ${activeOption === "group" && "text-purple-500"}`}
          >
            <UsersIcon />
            Groups
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {activeGroup ? (
          <>
            <div className="p-4 pt-[7px] pb-[11px] border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {myGroups.find(g => g.id === activeGroup)?.icon ? (
                  <img
                    src={myGroups.find(g => g.id === activeGroup)?.icon}
                    alt={myGroups.find(g => g.id === activeGroup)?.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {myGroups.find(g => g.id === activeGroup)?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {myGroups.find(g => g.id === activeGroup)?.name}
                  </div>
                  <div className="text-xs text-green-500">{myGroups.find(g => g.id === activeGroup)?.members.length} Members</div>
                </div>
              </div>
              <div className="flex gap-4 text-gray-600">
                <button
                  className='cursor-pointer'
                  onClick={() => setOpenGroupInfo(true)}>
                  <InfoIcon />
                </button>
              </div>
            </div>
            <div
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#f5f5f5]"
            >
              {loadingOlderMessages && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                </div>
              )}
              {!Object.values(groupedMessage).some(group => group.length > 0) && (
                <div className="text-center text-gray-500">
                  No messages yet. Start chatting!
                </div>
              )}
              {Object.entries(groupedMessage).map(([dateTitle, msgs]) => (
                <div key={dateTitle}>
                  <div className='flex justify-center sticky top-0 mb-3'>
                    <div className='w-fit pt-[2px] pb-[2px] pl-2 pr-2 font-medium border rounded-[3px] bg-white'>
                      {dateTitle}
                    </div>
                  </div>
                  {msgs.map((msg, index) => {
                    if (msg.isSystemMessage) {
                      return (
                        <div key={`${index + 1}`} className='flex justify-center mb-3'>
                          <div className="inline-block px-4 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
                            {msg.systemMessageData?.userId === userId ? msg.systemMessageType === "user_joined" ? "You joined" : "You left" : msg.content}
                          </div>
                        </div>
                      );
                    }
                    if (msg.sender) {
                      const isSentByMe = msg.sender._id === userId;
                      const isFirstOfSequence = index === 0 || msg.sender._id !== msgs[index - 1]?.sender?._id;

                      return (
                        <div key={`${index + 1}`} className={`flex gap-[5px] mb-3 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                          {!isSentByMe && (
                            <div className="min-w-[28px]">
                              {isFirstOfSequence ? (
                                msg.sender?.profileimage?.url ? (
                                  <img
                                    src={msg.sender.profileimage.url}
                                    alt="not found"
                                    className="w-7 h-7 rounded-full"
                                  />
                                ) : (
                                  <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                                    {msg.sender.name.charAt(0).toUpperCase()}
                                  </div>
                                )
                              ) : (
                                <div className="w-7 h-7" />
                              )}
                            </div>
                          )}
                          <div>
                            {!isSentByMe && isFirstOfSequence && (
                              <div className="mb-[3px] text-sm font-semibold text-purple-500">{msg.sender.name}</div>
                            )}
                            <div className='relative flex items-center gap-2 group'>
                              {(isSentByMe && msg.status !== 'deleted') && (
                                <div className='transition-all duration-400 ease-in-out opacity-0 group-hover:opacity-100'>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === msg._id ? null : msg._id);
                                    }}
                                    className='bg-white rounded-full p-[6px] shadow cursor-pointer'
                                  >
                                    <EllipsisVerticalIcon size={14} color='gray' />
                                  </button>
                                  {activeMenuId === msg._id && (
                                    <div ref={menuRef} className="absolute left-[-120px] top-[-10px] w-28 bg-white rounded-sm shadow-lg text-sm z-10">
                                      <button
                                        onClick={() => {
                                          setEditMessage(msg);
                                          setNewMessage(msg.content);
                                        }}
                                        className="flex justify-start items-center gap-2 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50"
                                      >
                                        <PencilIcon size={12} />Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          editOrDeleteMessage('deleted', msg._id, "");
                                        }}
                                        className="flex justify-start items-center gap-2 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-red-600"
                                      >
                                        <Trash2Icon size={15} /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className={`min-w-[80px] max-w-xs rounded-lg p-3 pt-[9px] peer pb-1 ${isSentByMe ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {msg.status !== 'deleted' ? (
                                  <span>{msg.content}</span>
                                ) : (
                                  <span className="flex items-center gap-1 italic">
                                    <BanIcon size={13} /> This message was deleted
                                  </span>
                                )}
                                <div className="mt-[5px] text-[10px] text-right">
                                  {msg.status === 'edited' && (
                                    <span className="mr-2">Edited</span>
                                  )}
                                  {moment(msg.createdAt).format('hh:mm A')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className='flex justify-center mb-4'>
              <div className="w-full ml-6 mr-6 bg-white rounded-md shadow-sm relative">
                {typingUsers.length > 0 && (
                  <div className="absolute top-[-26px] left-0 pl-[7px] pr-[5px] pt-[2px] pb-[4px] border-b border-b-gray-100 rounded-t-md bg-white">
                    {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                  </div>
                )}
                <div className="flex flex-col border-b border-b-gray-200">
                  {editMessage && (
                    <div className="flex justify-between m-[6px] mb-3 p-2 rounded-md bg-[#f5f5f5]">
                      <div className='flex flex-col'>
                        <span className="text-[14px] text-black mb-1">Edit message</span>
                        <span className="text-[12px] text-[#727272]">{editMessage.content}</span>
                      </div>
                      <button className="h-fit cursor-pointer">
                        <XIcon
                          size={18}
                          onClick={() => {
                            setEditMessage(null);
                            setNewMessage("");
                          }}
                        />
                      </button>
                    </div>
                  )}
                  <div className={`flex px-3 ${editMessage ? "h-[30px]" : "h-[45px]"}`}>
                    <input
                      value={newMessage}
                      placeholder="Enter your message here"
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          sendMessage();
                        }
                      }}
                      className="w-full flex-1 border-none outline-none placeholder-gray-400 text-gray-700"
                    />
                  </div>
                </div>
                <div className="relative p-4 px-2 flex items-center justify-between">
                  <div ref={emojiPickerRef} className={`absolute bottom-12 left-0 z-50 transition-opacity duration-300 ease-in-out opacity-0 ${showEmojiPicker && "opacity-100"}`}>
                    <EmojiPicker
                      width={300}
                      height={350}
                      onEmojiClick={onEmojiClick}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                  <SmileIcon
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`text-gray-400 cursor-pointer hover:text-purple-500 ${showEmojiPicker && 'text-purple-500'}`}
                  />
                  <button
                    disabled={!newMessage.trim()}
                    onClick={() => sendMessage()}
                    className="text-purple-600 text-lg cursor-pointer hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendHorizonalIcon />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
            <div className="mb-6">
              <MessageSquareTextIcon size={100} color="#DCDCDC" />
            </div>
            <h2 className="text-xl font-semibold text-black">Welcome to your Conversations</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Select a chat from the list to start exploring your messages or begin a new conversation
            </p>
          </div>
        )}
      </div>
      <div
        className={`
          flex flex-1 flex-col bg-white border-gray-200 shadow
          transition-all duration-400 ease-in-out overflow-hidden
          ${openGroupInfo ? 'max-w-[300px] ' : 'max-w-0 '}
        `}
      >
        <div className='p-4 border-b flex justify-between items-center w-full'>
          <div className="font-bold text-lg">
            Group Info
          </div>
          <button className='cursor-pointer' onClick={() => setOpenGroupInfo(false)}><XIcon /></button>
        </div>
        <div className='flex-1 h-full overflow-auto'>
          <div className='border-b border-b-gray-200 text-center pt-7 pb-7 flex flex-col items-center'>
            <img
              alt="not found"
              src={myGroups.find(g => g.id === activeGroup)?.icon}
              className="w-30 h-30 rounded-full"
            />
            <div className='mt-3 text-lg font-semibold'>
              {myGroups.find(g => g.id === activeGroup)?.name}
            </div>
            <div>
              <div className="mt-2 text-sm text-gray-500 ">{myGroups.find(g => g.id === activeGroup)?.members.length} Members</div>
            </div>
          </div>
          <div className="border-b border-b-gray-200 flex flex-col gap-4 p-4">
            <button
              onClick={() => leaveGroupChat()}
              className="flex justify-start items-center font-semibold text-[16px] text-[#f44649] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Leave
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {myGroups.find(g => g.id === activeGroup)?.members.map((member, i) => (
                <div key={`${i + 1}`} className="flex items-center gap-3">
                  <div className='flex gap-3 items-center'>
                    {member.avatar ?
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 min-w-10 rounded-full" />
                      :
                      <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    }
                    <div className='font-bold'>{member.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;