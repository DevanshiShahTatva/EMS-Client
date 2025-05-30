"use client";

import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { SendHorizonalIcon, InfoIcon, Trash2, LogOut, XIcon } from "lucide-react";

import { connectSocket, disconnectSocket, getSocket } from './socket';
import { apiCall } from '@/utils/services/request';
import { IGroup, IMessage } from './type';

const Chat = () => {
  const [userId, setUserId] = useState<null | string>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          lastMessage: group.lastMessage?.content ?? '',
          lastMessageSender: group.lastMessage?.sender.name || '',
          lastMessageTime: group.lastMessage ? moment(group.lastMessage.createdAt).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

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
      setMessages(data.messages);
    });

    socket.on('group_member_updated', ({ groupId, newMember }) => {
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

    socket.on("new_group_message", (message) => {
      if (message.group === activeGroup) {
        setMessages(prev => [...prev, message]);
        setMyGroups(prev => prev.map((group) =>
          group.id === message.group
            ? {
              ...group,
              lastMessage: message.content,
              senderId: message.sender._id,
              lastMessageSender: message.sender.name,
              lastMessageTime: moment(message.createdAt).format('hh:mm A')
            }
            : group
        ));
      }
    });

    return () => {
      socket.emit("leave_group_chat", { groupId: activeGroup });
      socket.off("initial_messages");
      socket.off("new_group_message");
    };
  }, [activeGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groupMessagesByDate = (messages: IMessage[]) => {
    return messages.reduce<Record<string, IMessage[]>>((groups, message) => {
      let dateKey = '';
      const msgDate = moment(message.createdAt);

      if (msgDate.isSame(moment(), 'day')) {
        dateKey = 'Today';
      } else if (msgDate.isSame(moment().subtract(1, 'days'), 'day')) {
        dateKey = 'Yesterday';
      } else {
        dateKey = msgDate.format('D MMMM, YYYY');
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);
      return groups;
    }, {});
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeGroup) return;

    const socket = getSocket();
    socket.emit("group_message", {
      groupId: activeGroup,
      content: newMessage.trim(),
    });

    setNewMessage("");
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
              className={`w-full text-start px-4 py-3 border-b border-b-gray-200 hover:bg-gray-200 cursor-pointer ${activeGroup === group.id ? 'bg-gray-100' : ''}`}
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
        <div className="flex justify-around p-3 border-t bg-white">
          <button className="text-gray-500 cursor-pointer">
            Users
          </button>
          <button
            onClick={() => fetchMyGroup()}
            className="text-gray-500 cursor-pointer"
          >
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
                <button className='cursor-pointer' onClick={() => setOpenGroupInfo(true)}><InfoIcon /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#f5f5f5]">
              {messages.length === 0 && (
                <div className="text-center text-gray-500">
                  No messages yet. Start chatting!
                </div>
              )}
              {Object.entries(groupMessagesByDate(messages)).map(([dateTitle, msgs]) => (
                <div key={dateTitle}>
                  <div className='flex justify-center sticky top-0 mb-3'>
                    <div className='w-fit pt-[2px] pb-[2px] pl-2 pr-2 font-medium border rounded-[3px] bg-white'>
                      {dateTitle}
                    </div>
                  </div>
                  {msgs.map((msg, index) => {
                    const isSentByMe = msg.sender._id === userId;
                    const isFirstOfSequence = index === 0 || msg.sender._id !== msgs[index - 1].sender._id;

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
                          <div className={`min-w-[80px] max-w-xs rounded-xl p-3 pb-1 ${isSentByMe ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {msg.content}
                            <div className="mt-[5px] text-[10px] text-right">
                              {moment(msg.createdAt).format('hh:mm A')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t bg-white p-4 flex items-center gap-3">
              <button>➕</button>
              <input
                type="text"
                value={newMessage}
                placeholder="Type a message"
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    sendMessage();
                  }
                }}
                className="flex-1 p-2 border rounded-full bg-gray-200 outline-none"
              />
              <button
                disabled={!newMessage.trim()}
                onClick={() => sendMessage()}
                className="text-purple-600 text-lg cursor-pointer hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizonalIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f5f5f5]">
            <div className="text-center p-6">
              <div className="text-2xl text-gray-400 mb-2">💬</div>
              <p className="text-gray-500">Select a group to start chatting</p>
            </div>
          </div>
        )}
      </div>
      {openGroupInfo && (
        <div className='flex flex-1 flex-col bg-white max-w-[300px] shadow'>
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
              <button className="flex justify-start items-center font-semibold text-[16px] text-[#f44649] cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Delete Chat</button>
              <button className="flex justify-start items-center font-semibold text-[16px] text-[#f44649] cursor-pointer"><LogOut className="mr-2 h-4 w-4" /> Leave</button>
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
      )}
    </div>
  );
};

export default Chat;