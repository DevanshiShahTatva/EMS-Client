"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquareTextIcon } from "lucide-react";
import moment from 'moment';

import { connectSocket, disconnectSocket } from './socket';
import ChatList from './ChatList';
import ChatInfoSidebar from './ChatInfoSidebar';
import GroupChatContent from './GroupChatContent';
import PrivateChatContent from './PrivateChatContent';
import { apiCall } from '@/utils/services/request';
import { IGroup, IPrivateChat } from './type';

const ChatLayout = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [myPrivateChats, setMyPrivateChats] = useState<IPrivateChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatType, setActiveChatType] = useState<'group' | 'private'>('private');
  const [openChatInfo, setOpenChatInfo] = useState<boolean>(false);

  const getDateKey = (date: string | Date) => {
    const msgDate = moment(date);
    if (msgDate.isSame(moment(), 'day')) return 'Today';
    if (msgDate.isSame(moment().subtract(1, 'days'), 'day')) return 'Yesterday';
    return msgDate.format('D MMMM, YYYY');
  };

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    fetchMyGroup();
    fetchMyPrivateChats();
  }, []);

  const fetchMyGroup = async () => {
    try {
      const response: { data: any[]; userId: string } = await apiCall({
        endPoint: '/chat/my-group-chat',
        method: "GET",
        withToken: true,
      });
      if (response.data) {
        setMyGroups(response.data.map((group) => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
          members: group.members,
          senderId: group.senderId ?? null,
          lastMessage: group.lastMessage,
          lastMessageSender: group.lastMessageSender,
          lastMessageTime: group.lastMessage ? moment(group.lastMessageTime).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
      }
    } catch (error) {
      console.error("Err:", error);
    }
  };

  const fetchMyPrivateChats = async () => {
    try {
      const response: { data: any[]; userId: string } = await apiCall({
        endPoint: '/chat/my-private-chat',
        method: "GET",
        withToken: true,
      });
      if (response.data) {
        setMyPrivateChats(response.data.map((chat) => ({
          id: chat._id,
          name: response.userId === chat.sender._id ? chat.receiver.name : chat.sender.name,
          icon: response.userId === chat.sender._id ? chat.receiver.profileimage?.url : chat.sender.profileimage?.url,
          sender: response.userId === chat.sender._id ? chat.sender : chat.receiver,
          receiver: response.userId === chat.sender._id ? chat.receiver : chat.sender,
          lastMessage: chat.lastMessage,
          lastMessageSender: chat.lastMessageSender,
          lastMessageTime: chat.lastMessage ? moment(chat.lastMessageTime).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
      }
    } catch (error) {
      console.error("Err:", error);
    }
  };

  const handleSetActiveChat = (id: string, type: 'group' | 'private') => {
    setActiveChatId(id);
    setActiveChatType(type);
    setOpenChatInfo(false);
  };

  const handleStartChat = async (memberId: string) => {
    try {
      const response = await apiCall({
        endPoint: '/chat/create-private-chat',
        method: "POST",
        body: {
          memberId: memberId,
        },
        withToken: true,
      });

      const { chat } = await response.json();
      if (chat) {
        const newChatEntry: IPrivateChat = {
          id: chat._id,
          sender: chat.sender,
          receiver: chat.receiver,
          lastMessage: chat.lastMessage,
          lastMessageSender: chat.lastMessageSender,
          lastMessageTime: chat.lastMessage ? moment(chat.lastMessageTime).format('hh:mm A') : '',
        };

        setMyPrivateChats(prev => {
          const existingChat = prev.find(c => c.id === newChatEntry.id);
          if (!existingChat) {
            return [...prev, newChatEntry];
          }
          return prev;
        });
        handleSetActiveChat(chat, 'private');
      }
    } catch (error) {
      console.error("Err:", error);
    }
  };

  const getActiveChatDetails = () => {
    if (activeChatType === 'group' && activeChatId) {
      const activeGroupDetails = myGroups.find(g => g.id === activeChatId);
      return activeGroupDetails ? { type: 'group', ...activeGroupDetails } : null;
    } else if (activeChatType === 'private' && activeChatId) {
      const activePrivateChatDetails = myPrivateChats.find(c => c.id === activeChatId);
      if (activePrivateChatDetails) {
        const participant = activePrivateChatDetails.sender._id === userId
          ? activePrivateChatDetails.receiver
          : activePrivateChatDetails.sender;
        return { type: 'private', ...activePrivateChatDetails, participantDetails: participant };
      }
      return null;
    }
    return null;
  };

  const currentChatDetails = getActiveChatDetails();

  return (
    <div className="w-full flex bg-gray-100">
      <ChatList
        userId={userId}
        chatType={activeChatType}
        myGroups={myGroups}
        myPrivateChats={myPrivateChats}
        activeChatId={activeChatId}
        setChatType={setActiveChatType}
        setActiveChat={handleSetActiveChat}
      />
      <div className="flex-1 flex flex-col">
        {(activeChatId && activeChatType) && (
          activeChatType === 'group' ? (
            <GroupChatContent
              userId={userId}
              groupId={activeChatId}
              getDateKey={getDateKey}
              setMyGroups={setMyGroups}
              setOpenChatInfo={setOpenChatInfo}
              currentGroupDetails={currentChatDetails as IGroup}
            />
          ) : (
            <PrivateChatContent
              userId={userId}
              chatId={activeChatId}
              getDateKey={getDateKey}
              setOpenChatInfo={setOpenChatInfo}
              setMyPrivateChats={setMyPrivateChats}
              currentPrivateChatDetails={currentChatDetails as IPrivateChat}
            />
          )
        )}
        {!(activeChatId && activeChatType) && (
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
      {activeChatType === 'group' && (
        <ChatInfoSidebar
          userId={userId}
          openChatInfo={openChatInfo}
          setMyGroups={setMyGroups}
          setOpenChatInfo={setOpenChatInfo}
          handleStartChat={handleStartChat}
          setActiveChatId={setActiveChatId}
          currentChatDetails={currentChatDetails as IGroup}
        />
      )}
    </div>
  );
};

export default ChatLayout;