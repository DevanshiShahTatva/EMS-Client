'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareTextIcon } from "lucide-react";
import moment from 'moment';

import { connectSocket, disconnectSocket, getSocket } from '@/utils/services/socket';
import ChatList from './ChatList';
import ChatInfoSidebar from './ChatInfoSidebar';
import GroupChatContent from './GroupChatContent';
import PrivateChatContent from './PrivateChatContent';
import { apiCall } from '@/utils/services/request';
import { IGroup, IPrivateChat } from './type';
import { useSearchParams } from 'next/navigation';

const ChatLayout = () => {
  const searchParams = useSearchParams();
  const privateChatId = searchParams.get('id');
  const groupChatId = searchParams.get('group');
  const handledRef = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [myPrivateChats, setMyPrivateChats] = useState<IPrivateChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatType, setActiveChatType] = useState<'group' | 'private'>('group');
  const [currentChatType, setCurrentChatType] = useState<'group' | 'private'>('group');
  const [openChatInfo, setOpenChatInfo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    connectSocket();

    const socket = getSocket();
    socket.emit('activate_chat_handlers');

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (privateChatId && !handledRef.current) {
      fetchMyPrivateChats();
    } else if(groupChatId && !handledRef.current) {
      fetchMyGroup();
    } else {
      fetchMyGroup();
    }
  }, []);

  const fetchMyGroup = async () => {
    setIsLoading(true);
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
          image: group.icon,
          members: group.members,
          senderId: group.senderId,
          lastMessage: group.lastMessage,
          lastMessageSender: group.lastMessageSender,
          lastMessageTime: group.lastMessage ? moment(group.lastMessageTime).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
        if(groupChatId && !handledRef.current) {
          handleSetActiveChat(groupChatId, "group");
          handledRef.current = true;
          
          const url = new URL(window.location.href);
          url.searchParams.delete("group");
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch (error) {
      console.error("Err:", error);
    }
    setIsLoading(false);
  };

  const fetchMyPrivateChats = async () => {
    setIsLoading(true);
    try {
      const response: { data: any[]; userId: string } = await apiCall({
        endPoint: '/chat/my-private-chat',
        method: "GET",
        withToken: true,
      });
      if (response.data) {
        setMyPrivateChats(response.data.map((chat) => ({
          id: chat.id,
          name: chat.name,
          image: chat.image,
          senderId: chat.senderId,
          lastMessage: chat.lastMessage,
          lastMessageSender: chat.lastMessageSender,
          lastMessageTime: chat.lastMessage ? moment(chat.lastMessageTime).format('hh:mm A') : '',
        })));
        setUserId(response.userId);
        if (privateChatId && !handledRef.current) {
          handleSetActiveChat(privateChatId, "private");
          handledRef.current = true;
          
          const url = new URL(window.location.href);
          url.searchParams.delete("id");
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch (error) {
      console.error("Err:", error);
    }
    setIsLoading(false);
  };

  const fetchChatList = async (type: 'group' | 'private') => {
    setActiveChatType(type);
    setIsLoading(true);

    if (type === 'group') {
      fetchMyGroup();
    } else {
      fetchMyPrivateChats();
    }
  }

  const handleStartChat = async (memberId: string) => {
    try {
      const { chat } = await apiCall({
        endPoint: '/chat/create-private-chat',
        method: "POST",
        body: { memberId },
        withToken: true,
      });

      if (chat) {
        const newChatEntry: IPrivateChat = {
          id: chat.id,
          name: chat.name,
          image: chat.image,
          senderId: chat.senderId,
          lastMessage: '',
          lastMessageSender: '',
          lastMessageTime: ''
        };

        setMyPrivateChats(prev => {
          const existingChat = prev.find(c => c.id === newChatEntry.id);
          if (!existingChat) {
            return [...prev, newChatEntry];
          }
          return prev;
        });
        handleSetActiveChat(chat.id, 'private');
      }
    } catch (error) {
      console.error("Err:", error);
    }
  };

  const handleSetActiveChat = (id: string, type: 'group' | 'private') => {
    setActiveChatId(id);
    setActiveChatType(type);
    setCurrentChatType(type);
    setOpenChatInfo(false);
  };

  const getActiveChatDetails = () => {
    if (activeChatId) {
      if (currentChatType === 'group') {
        return myGroups.find(g => g.id === activeChatId);
      } else if (currentChatType === 'private') {
        return myPrivateChats.find(c => c.id === activeChatId);
      }
    }
    return null;
  };

  const currentChatDetails = getActiveChatDetails();
  return (
    <div className="w-full flex bg-gray-100">
      <ChatList
        userId={userId}
        isLoading={isLoading}
        chatType={activeChatType}
        myGroups={myGroups}
        myPrivateChats={myPrivateChats}
        activeChatId={activeChatId}
        fetchChatList={fetchChatList}
        setActiveChat={handleSetActiveChat}
      />
      <div className="flex-1 flex flex-col">
        {(activeChatId && currentChatType) && (
          currentChatType === 'group' ? (
            <GroupChatContent
              userId={userId}
              groupId={activeChatId}
              setMyGroups={setMyGroups}
              setOpenChatInfo={setOpenChatInfo}
              currentGroupDetails={currentChatDetails as IGroup}
            />
          ) : (
            <PrivateChatContent
              userId={userId}
              chatId={activeChatId}
              setOpenChatInfo={setOpenChatInfo}
              setMyPrivateChats={setMyPrivateChats}
              currentPrivateChatDetails={currentChatDetails as IPrivateChat}
            />
          )
        )}
        {!(activeChatId && currentChatType) && (
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
      {currentChatType === 'group' && (
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