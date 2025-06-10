import React, { useRef, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { Trash2Icon, PencilIcon, BanIcon, EllipsisVerticalIcon } from "lucide-react";

import { apiCall } from '@/utils/services/request';
import { IChatWindowProps, IMessage } from './type';

const ChatWindow: React.FC<IChatWindowProps> = ({
  chatId,
  userId,
  isGroup,
  isLoading,
  isScrollBottom,
  groupedMessage,
  activeMenuId,
  chatApiEndpoint,
  groupMessagesByDate,
  setActiveMenuId,
  setEditMessage,
  setIsScrollBottom,
  editOrDeleteMessage,
  setGroupedMessage,
}) => {
  const [loadingOlderMessages, setLoadingOlderMessages] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    setGroupedMessage({});
    setHasMoreMessages(true);
    setLoadingOlderMessages(false);

  }, [chatId]);

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
  }, [setActiveMenuId]);

  const loadOlderMessages = useCallback(async () => {
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

      const response: { data: IMessage[]; hasMore: boolean } = await apiCall({
        endPoint: `${chatApiEndpoint}?before=${oldestMessage.createdAt}`,
        method: "GET",
        withToken: true,
      });

      if (response.data?.length) {
        setIsScrollBottom(false);
        setGroupedMessage(prev => {
          const newMsgs = groupMessagesByDate(response.data);
          const mergedGroups = { ...newMsgs };
          for (const dateKey in prev) {
            if (mergedGroups[dateKey]) {
              mergedGroups[dateKey] = [...newMsgs[dateKey], ...prev[dateKey]];
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
      }
      setHasMoreMessages(response.hasMore);
    } catch (error) {
      console.error('Err:', error);
    } finally {
      setLoadingOlderMessages(false);
    }
  }, [loadingOlderMessages, hasMoreMessages, groupedMessage, chatApiEndpoint, groupMessagesByDate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop === 0 && hasMoreMessages) {
      loadOlderMessages();
    }
  };

  const scrollToBottom = () => {
    setIsScrollBottom(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageMenuClick = (messageId: string) => {
    setActiveMenuId(activeMenuId === messageId ? null : messageId);
  };

  const handleEditClick = (message: IMessage) => {
    setEditMessage(message);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (messageId: string) => {
    editOrDeleteMessage('deleted', messageId);
    setActiveMenuId(null);
  };

  const getSystemMessageText = (msg: IMessage) => {
    if (msg.systemMessageData?.userId === userId) {
      return msg.systemMessageType === "user_joined" ? "You joined" : "You left";
    }
    return msg.content;
  }

  return (
    <div
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-2 md:px-6 py-4 space-y-3 bg-[#f5f5f5]"
    >
      {isLoading
        ? <ChatSkeleton />
        : (
          <>
            {loadingOlderMessages && (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            )}
            {!Object.values(groupedMessage).some(group => group.length > 0) && (
              <div className="flex justify-center items-center h-full text-center text-gray-500">
                No messages yet. Start chatting!
              </div>
            )}
            {Object.entries(groupedMessage).map(([dateTitle, msgs]) => (
              <div key={dateTitle}>
                <div className='flex justify-center sticky top-0 mb-3 z-10'>
                  <div className='w-fit pt-[2px] pb-[2px] pl-2 pr-2 font-medium border border-gray-300 rounded-[4px] bg-white'>
                    {dateTitle}
                  </div>
                </div>
                {msgs.map((msg, index) => {
                  if (msg.isSystemMessage) {
                    return (
                      <div key={`${index + 1}`} className='flex justify-center mb-3'>
                        <div className="inline-block px-4 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
                          {getSystemMessageText(msg)}
                        </div>
                      </div>
                    );
                  }
                  if (msg.sender) {
                    const isSentByMe = msg.sender._id === userId;
                    const isFirstOfSequence = index === 0 || msg.sender._id !== msgs[index - 1]?.sender?._id;

                    return (
                      <div key={`${index + 1}`} className={`flex gap-[5px] mb-3 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                        {!isSentByMe && isGroup && (
                          <div className="min-w-[28px]">
                            {isFirstOfSequence && (
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
                            )}
                            {!isFirstOfSequence && (
                              <div className="w-7 h-7" />
                            )}
                          </div>
                        )}
                        <div>
                          {!isSentByMe && isGroup && isFirstOfSequence && (
                            <div className="mb-[3px] text-sm font-semibold text-purple-500">{msg.sender.name}</div>
                          )}
                          <div className='relative flex items-center gap-2 group'>
                            {(isSentByMe && msg.status !== 'deleted') && (
                              <div className='transition-all duration-400 ease-in-out opacity-0 group-hover:opacity-100'>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMessageMenuClick(msg._id);
                                  }}
                                  className='bg-white rounded-full p-[6px] shadow cursor-pointer'
                                >
                                  <EllipsisVerticalIcon size={14} color='gray' />
                                </button>
                                {activeMenuId === msg._id && (
                                  <div ref={menuRef} className="absolute left-[-120px] top-[-10px] w-28 bg-white rounded-sm shadow-lg text-sm z-10">
                                    <button
                                      onClick={() => handleEditClick(msg)}
                                      className="flex justify-start items-center gap-2 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50"
                                    >
                                      <PencilIcon size={12} />Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(msg._id)}
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
          </>
        )}
    </div>
  );
};

const ChatSkeleton = () => (
  <div className="bg-gray-100 animate-pulse space-y-3">
    <div className="flex justify-center">
      <div className="h-6 w-20 bg-gray-300 rounded" />
    </div>
    <SkeletonMessage />
    <SkeletonMessage isOutgoing />
    <SkeletonMessage />
    <SkeletonMessage isOutgoing />
    <SkeletonMessage />
  </div>
);

const SkeletonMessage = ({ isOutgoing = false }: { isOutgoing?: boolean }) => (
  <div className={`flex items-start gap-3 ${isOutgoing ? 'justify-end' : ''}`}>
    {!isOutgoing && (
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
    )}
    <div className={isOutgoing ? 'text-right' : ''}>
      {!isOutgoing && (
        <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
      )}
      <div
        className={`bg-gray-300 rounded-xl h-10 mb-1 ${isOutgoing ? 'w-40 ml-auto' : 'w-50'
          }`}
      />
    </div>
  </div>
);

export default ChatWindow;