import React, { useState, useEffect } from 'react';
import { getSocket } from './socket';
import moment from 'moment';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { IGroupedPrivateMessages, IMessage, IPrivateChatContentProps, IPrivateMessage } from './type';

const PrivateChatContent: React.FC<IPrivateChatContentProps> = ({
  chatId,
  userId,
  currentPrivateChatDetails,
  setMyPrivateChats,
  getDateKey,
  setOpenChatInfo
}) => {
  const [groupedMessage, setGroupedMessage] = useState<IGroupedPrivateMessages>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isScrollBottom, setIsScrollBottom] = useState(false);

  const handleInitialLoad = (data: { messages: IPrivateMessage[] }) => {
    setGroupedMessage(groupMessagesByDate(data.messages));
    setIsScrollBottom(true);
  };

  const handleReceiveMessage = (message: IPrivateMessage) => {
    if (message.privateChat === chatId) {
      setGroupedMessage(prev => addMessageToGroup(message, prev));
      setIsScrollBottom(true);
      setMyPrivateChats(prev => prev.map((chat) =>
        chat.id === message.privateChat
          ? {
            ...chat,
            lastMessage: message.content,
            senderId: message.sender?._id ?? "",
            lastMessageSender: message.sender?.name ?? "",
            lastMessageTime: moment(message.createdAt).format('hh:mm A')
          }
          : chat
      ));
    }
  };

  const handleEditDeletedMessage = ({ status, chatId: msgChatId, messageId, newMessage: updatedContent }: { status: 'edited' | 'deleted'; chatId: string; messageId: string; newMessage: string }) => {
    if (msgChatId === chatId) {
      setGroupedMessage(prev => {
        const newGroups = { ...prev };
        for (const dateKey in newGroups) {
          newGroups[dateKey] = newGroups[dateKey].map(msg =>
            msg._id === messageId ? { ...msg, status, content: updatedContent } : msg
          );
        }
        return newGroups;
      });
    }
  };

  const handleSuccessMessageOperation = ({ status }: { status: 'edited' | 'deleted' }) => {
    if (status === "edited") {
      setEditMessage(null);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!chatId || !socket) return;

    setGroupedMessage({});
    setTypingUsers([]);
    setEditMessage(null);
    setActiveMenuId(null);

    socket.emit("join_private_chat", { chatId });

    socket.on("initial_private_messages", handleInitialLoad);
    socket.on("receive_private_message", handleReceiveMessage);
    socket.on("new_edited_or_deleted_private_message", handleEditDeletedMessage);
    socket.on("private_message_edited_or_deleted_successfully", handleSuccessMessageOperation);

    return () => {
      socket.off("initial_private_messages", handleInitialLoad);
      socket.off("receive_private_message", handleReceiveMessage);
      socket.off("new_edited_or_deleted_private_message", handleEditDeletedMessage);
      socket.off("private_message_edited_or_deleted_successfully", handleSuccessMessageOperation);
    };
  }, [chatId, setMyPrivateChats]);

  useEffect(() => {
    const socket = getSocket();
    if (!chatId || !socket) return;

    socket.on('private_user_typing', ({ user, chatId: typingChatId }: { user: { _id: string; name: string }; chatId: string }) => {
      if (typingChatId === chatId && user._id !== userId) {
        setTypingUsers((prev) => [...new Set([...prev, user.name])]);
      }
    });

    socket.on('private_user_stopped_typing', ({ user, chatId: typingChatId }: { user: { _id: string; name: string }; chatId: string }) => {
      if (typingChatId === chatId) {
        setTypingUsers((prev) => prev.filter((name) => name !== user.name));
      }
    });

    return () => {
      socket.off('private_user_typing');
      socket.off('private_user_stopped_typing');
    };
  }, [chatId, userId]);

  const groupMessagesByDate = (messages: IPrivateMessage[]) => {
    return messages.reduce((groups, message) => {
      const dateKey = getDateKey(message.createdAt);
      groups[dateKey] = groups[dateKey] || [];
      groups[dateKey].push(message);
      return groups;
    }, {} as IGroupedPrivateMessages);
  };

  const addMessageToGroup = (message: IPrivateMessage, existingGroups: IGroupedPrivateMessages) => {
    const dateKey = getDateKey(message.createdAt);
    return {
      ...existingGroups,
      [dateKey]: [...(existingGroups[dateKey] || []), message]
    };
  };

  const handleStartTyping = () => {
    const socket = getSocket();
    if (!socket || !chatId) return;
    socket.emit('user_typing', { chatId });
  }

  const handleStopTyping = () => {
    const socket = getSocket();
    if (!socket || !chatId) return;
    socket.emit('user_stopped_typing', { chatId });
  };

  const handleSendMessage = (content: string) => {
    const socket = getSocket();
    if (!socket || !chatId) return;
    socket.emit("new_private_message", { chatId, content });
  };

  const handleDeleteMessage = (status: 'deleted', messageId: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("edit_or_delete_private_message", {
      status,
      chatId,
      messageId,
      newContent: ""
    });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("edit_or_delete_private_message", {
      chatId,
      messageId,
      newContent,
      status: 'edited',
    });
  };

  return (
    <>
      <ChatHeader
        isGroup={false}
        setOpenChatInfo={setOpenChatInfo}
        currentChatDetails={currentPrivateChatDetails}
      />
      <ChatWindow
        chatId={chatId}
        userId={userId}
        isGroup={false}
        isScrollBottom={isScrollBottom}
        groupedMessage={groupedMessage}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        setIsScrollBottom={setIsScrollBottom}
        setEditMessage={setEditMessage}
        editOrDeleteMessage={handleDeleteMessage}
        groupMessagesByDate={groupMessagesByDate}
        setGroupedMessage={setGroupedMessage as any}
        chatApiEndpoint={`/chat/private-messages/${chatId}`}
      />
      <MessageInput
        typingUsers={typingUsers}
        editMessage={editMessage}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onStartTyping={handleStartTyping}
        onStopTyping={handleStopTyping}
        setEditMessage={setEditMessage}
      />
    </>
  );
};

export default PrivateChatContent;