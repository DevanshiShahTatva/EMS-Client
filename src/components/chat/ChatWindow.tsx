import React, { useRef, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Trash2Icon, PencilIcon, BanIcon, EllipsisVerticalIcon, Loader2 } from "lucide-react";

import { apiCall } from '@/utils/services/request';
import { IChatWindowProps, IMessage } from './type';

const ChatWindow: React.FC<IChatWindowProps> = ({
  chatId,
  userId,
  isGroup,
  isLoading,
  isNewMessages,
  isScrollBottom,
  groupedMessage,
  activeMenuId,
  chatApiEndpoint,
  groupMessagesByDate,
  setIsNewMessages,
  setActiveMenuId,
  setEditMessage,
  setIsScrollBottom,
  editOrDeleteMessage,
  setGroupedMessage,
}) => {
  const [loadingOlderMessages, setLoadingOlderMessages] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set());
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    setGroupedMessage({});
    setHasMoreMessages(true);
    setLoadingOlderMessages(false);
    setDeletingMessages(new Set());

  }, [chatId]);

  useEffect(() => {
    isScrollBottom && scrollToBottom();
  }, [groupedMessage, isScrollBottom]);

  useEffect(() => {
    if (!isScrollBottom) return;

    const imageCount = Object.values(groupedMessage)
      .flat()
      .filter(msg => msg.msgType === 'image' && msg.status !== 'deleted')
      .length;

    setTotalImages(imageCount);
    setImagesLoaded(0);
  }, [groupedMessage, isScrollBottom]);

  useEffect(() => {
    if (isScrollBottom && totalImages > 0 && imagesLoaded >= totalImages) {
      scrollToBottom();
    }
  }, [imagesLoaded, totalImages, isScrollBottom]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageMenuClick = (messageId: string) => {
    setActiveMenuId(activeMenuId === messageId ? null : messageId);
  };

  const handleEditClick = (message: IMessage) => {
    setEditMessage(message);
    setActiveMenuId(null);
  };

  const handleDeleteClick = async (messageId: string, msgType: 'text' | 'image', imageId?: string) => {
    setDeletingMessages(prev => new Set(prev).add(messageId));
    setActiveMenuId(null);

    if (msgType === 'image') {
      try {
        const response = await apiCall({
          endPoint: `/chat/remove-image?imageId=${imageId}`,
          method: "DELETE",
          withToken: true,
        });

        if (response.success) {
          setDeletingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
          });
          editOrDeleteMessage('deleted', messageId);
        } else {
          setDeletingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
          });
          toast.error("Failed to delete image message");
        }
      } catch (err: any) {
        setDeletingMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
        console.log("Err:" + err);
        toast.error(err.message ?? "Failed to delete image message");
      }
    } else {
      setTimeout(() => {
        setDeletingMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
        editOrDeleteMessage('deleted', messageId);
      }, 300);
    }
  };

  const getSystemMessageText = (msg: IMessage) => {
    const isCurrentUser = msg.systemMessageData?.userId === userId;
    const isAdmin = msg.systemMessageData?.adminId === userId;

    if (isAdmin) {
      switch (msg.systemMessageType) {
        case "user_added":
          return msg.content?.replace(/^Admin/, "You");
        case "user_removed":
          return msg.content?.replace(/^Admin/, "You");
        default:
          return msg.content;
      }
    } else {
      if (!isCurrentUser) {
        return msg.content;
      }
      switch (msg.systemMessageType) {
        case "user_added":
          return msg.content?.replace(/(Admin added ).+$/, "$1you");
        case "user_removed":
          return msg.content?.replace(/(Admin removed ).+$/, "$1you");
        case "user_joined":
          return "You joined";
        case "user_left":
          return "You left";
        default:
          return msg.content;
      }
    }
  };

  const renderDateHeader = (dateTitle: string) => (
    <div className='flex justify-center sticky top-0 mb-3 z-10'>
      <div className='w-fit pt-[2px] pb-[2px] pl-2 pr-2 font-medium border border-gray-300 rounded-[4px] bg-white'>
        {dateTitle}
      </div>
    </div>
  );

  const renderSystemMessage = (msg: IMessage, index: number) => (
    <div key={`sys-${index}`} className='flex justify-center mb-3'>
      <div className="inline-block px-4 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
        {getSystemMessageText(msg)}
      </div>
    </div>
  );

  const renderUserAvatar = (msg: IMessage, isFirst: boolean) => {
    if (!isFirst) return <div className="w-7 h-7" />;
    if (msg.sender?.profileimage?.url) {
      return (
        <img
          src={msg.sender.profileimage.url}
          alt="not found"
          className="w-7 h-7 rounded-full"
        />
      );
    }
    return (
      <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
        {msg.sender?.name?.charAt(0)?.toUpperCase()}
      </div>
    );
  };

  const renderMessageMenu = (msg: IMessage, isSentByMe: boolean) => {
    if (!isSentByMe || msg.status === 'deleted') return null;

    const isDeleting = deletingMessages.has(msg._id);

    return (
      <div className='relative transition-all duration-400 ease-in-out opacity-0 group-hover:opacity-100'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMessageMenuClick(msg._id);
          }}
          className='bg-white rounded-full p-[6px] shadow cursor-pointer'
          disabled={isDeleting}
        >
          <EllipsisVerticalIcon size={14} color={isDeleting ? '#ccc' : 'gray'} />
        </button>
        {activeMenuId === msg._id && !isDeleting && (
          <div
            ref={menuRef}
            className={`absolute left-[-120px] ${msg.msgType === 'image' ? "top-[-7px]" : "top-[-20px]"} w-28 bg-white rounded-sm shadow-lg text-sm z-10`}
          >
            {msg.msgType !== 'image' && (
              <button
                onClick={() => handleEditClick(msg)}
                className="flex justify-start items-center gap-2 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50"
              >
                <PencilIcon size={12} /> Edit
              </button>
            )}
            <button
              onClick={() => handleDeleteClick(msg._id, msg.msgType, msg.imageId)}
              className="flex justify-start items-center gap-2 w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-red-600"
            >
              <Trash2Icon size={15} /> Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMessageContent = (msg: IMessage) => {
    const isDeleting = deletingMessages.has(msg._id);

    if (msg.status === 'deleted') {
      return (
        <span className="flex items-center gap-1 italic">
          <BanIcon size={13} /> This message was deleted
        </span>
      );
    }

    if (isDeleting) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-sm opacity-70">Deleting...</span>
        </div>
      );
    }

    if (msg.msgType === 'image') {
      return <img
        src={msg.content}
        alt="not found"
        className='rounded-lg pb-1'
        onLoad={() => {
          if (isScrollBottom) {
            setImagesLoaded(prev => prev + 1);
            if (isNewMessages) {
              scrollToBottom();
              setIsNewMessages(false);
            }
          }
        }}
        onError={() => isScrollBottom && setImagesLoaded(prev => prev + 1)}
      />;
    }
    return <span>{msg.content}</span>;
  };

  const getMessageBubbleClassName = (msgType: string, status: string, isSentByMe: boolean, isDeleting: boolean) => {
    const baseClasses = "min-w-[80px] max-w-xs rounded-lg transition-all duration-300 peer";

    const isImage = msgType === 'image' && status !== 'deleted';
    const padding = isImage ? "p-[6px]" : "p-[12px] pt-[9px] pb-1";

    let theme = "";
    if (isDeleting) {
      theme = "bg-gray-300 text-gray-500 opacity-70 animate-pulse";
    } else if (isSentByMe) {
      theme = "bg-purple-500 text-white";
    } else {
      theme = "bg-gray-200 text-gray-700";
    }
    return `${baseClasses} ${padding} ${theme}`;
  };

  const renderMessageBubble = (msg: any, isSentByMe: boolean) => {
    const isDeleting = deletingMessages.has(msg._id);

    return (
      <div className={getMessageBubbleClassName(msg.msgType, msg.status, isSentByMe, isDeleting)}>
        {renderMessageContent(msg)}
        {!isDeleting && (
          <div className="mt-[5px] text-[10px] text-right">
            {msg.status === 'edited' && (
              <span className="mr-2">Edited</span>
            )}
            {moment(msg.createdAt).format('hh:mm A')}
          </div>
        )}
      </div>
    );
  };

  const renderMessageRow = (msg: IMessage, index: number, msgs: IMessage[]) => {
    const isSentByMe = msg.sender?._id === userId;
    const isFirstOfSequence = index === 0 || msg.sender?._id !== msgs[index - 1]?.sender?._id;
    const isDeleting = deletingMessages.has(msg._id);

    return (
      <div
        key={`msg-${index}`}
        className={`flex gap-[5px] mb-3 transition-all duration-300 ${isSentByMe ? 'justify-end' : 'justify-start'} ${isDeleting ? 'opacity-70 scale-95' : ''}`}
      >
        {!isSentByMe && isGroup && (
          <div className="min-w-[28px]">
            {renderUserAvatar(msg, isFirstOfSequence)}
          </div>
        )}
        <div>
          {!isSentByMe && isGroup && isFirstOfSequence && (
            <div className="mb-[3px] text-sm font-semibold text-purple-500">{msg.sender?.name}</div>
          )}
          <div className='flex items-center gap-2 group'>
            {renderMessageMenu(msg, isSentByMe)}
            {renderMessageBubble(msg, isSentByMe)}
          </div>
        </div>
      </div>
    );
  };

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
              <div className="mb-0 flex justify-center items-center h-full text-gray-500">
                No messages yet. Start chatting!
              </div>
            )}
            {Object.entries(groupedMessage).map(([dateTitle, msgs]) => (
              <div key={dateTitle}>
                {renderDateHeader(dateTitle)}

                {msgs.map((msg, index) =>
                  msg.isSystemMessage
                    ? renderSystemMessage(msg, index)
                    : renderMessageRow(msg, index, msgs)
                )}
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
      <div className={`bg-gray-300 rounded-xl h-10 mb-1 ${isOutgoing ? 'w-40 ml-auto' : 'w-50'}`} />
    </div>
  </div>
);

export default ChatWindow;