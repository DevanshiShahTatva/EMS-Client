import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getSocket } from '@/utils/services/socket';

import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { IGroupChatContentProps, IGroupedMessages, IMessage } from './type';

const GroupChatContent: React.FC<IGroupChatContentProps> = ({
  groupId,
  userId,
  currentGroupDetails,
  setMyGroups,
  setOpenChatInfo
}) => {
  const [groupedMessage, setGroupedMessage] = useState<IGroupedMessages>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isScrollBottom, setIsScrollBottom] = useState(false);

  const getDateKey = (date: string | Date) => {
    const msgDate = moment(date);
    if (msgDate.isSame(moment(), 'day')) return 'Today';
    if (msgDate.isSame(moment().subtract(1, 'days'), 'day')) return 'Yesterday';
    return msgDate.format('D MMMM, YYYY');
  };

  const addMessageToGroup = (message: IMessage, existingGroups: IGroupedMessages) => {
    const dateKey = getDateKey(message.createdAt);
    return {
      ...existingGroups,
      [dateKey]: [...(existingGroups[dateKey] || []), message]
    };
  };

  const groupMessagesByDate = (messages: IMessage[]) => {
    return messages.reduce((groups, message) => {
      const dateKey = getDateKey(message.createdAt);
      groups[dateKey] = groups[dateKey] || [];
      groups[dateKey].push(message);
      return groups;
    }, {} as IGroupedMessages);
  };

  const handleInitialLoad = ({ messages }: { messages: IMessage[] }) => {
    setGroupedMessage(groupMessagesByDate(messages));
    setIsScrollBottom(true);
  };

  const handleGroupMemberAdded = ({ groupId: addedGroupId, newMember }: { groupId: string; newMember: { id: string; name: string; avatar?: string } }) => {
    if (addedGroupId === groupId) {
      setMyGroups(prev => prev.map((group) =>
        group.id === addedGroupId
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
    }
  };

  const handleGroupMemberRemoved = ({ groupId: removedGroupId, removedMemberId }: { groupId: string; removedMemberId: string }) => {
    if (removedGroupId === groupId) {
      if (removedMemberId === userId) {
        setGroupedMessage({});
        setOpenChatInfo(false);
        setMyGroups(prev => prev.filter(group => group.id !== removedGroupId));
        toast.success("You were removed from the group chat!");
      } else {
        setMyGroups(prev => prev.map((group) =>
          group.id === removedGroupId
            ? {
              ...group,
              members: group.members.filter(member => member.id !== removedMemberId)
            }
            : group
        ));
      }
    }
  };

  const handleNewGroupMessage = (message: any) => {
    if (message.group === groupId) {
      setGroupedMessage(prev => addMessageToGroup(message, prev));
      setIsScrollBottom(true);

      setMyGroups(prev => {
        const index = prev.findIndex(group => group.id === message.group);
        if (index === -1) return prev;

        const updatedGroup = {
          ...prev[index],
          lastMessage: message.content,
          senderId: message.sender?._id ?? "",
          lastMessageSender: message.sender?.name ?? "",
          lastMessageTime: moment(message.createdAt).format('hh:mm A'),
          updatedAt: new Date(message.createdAt)
        };

        const newGroups = prev.slice();
        newGroups.splice(index, 1);
        newGroups.unshift(updatedGroup);
        return newGroups;
      });
    }
  };

  const handleEditedOrDeletedMessage = ({ status, groupId: msgGroupId, messageId, isLastMessage, updatedTime, newMessage: updatedContent }: any) => {
    if (msgGroupId === groupId) {
      setGroupedMessage(prev => {
        const newGroups = { ...prev };
        for (const dateKey in newGroups) {
          newGroups[dateKey] = newGroups[dateKey].map(msg =>
            msg._id === messageId ? { ...msg, status, content: updatedContent } : msg
          );
        }
        return newGroups;
      });
      if (isLastMessage) {
        setMyGroups(prev => prev.map((group) =>
          group.id === msgGroupId
            ? {
              ...group,
              lastMessage: updatedContent,
              lastMessageTime: updatedTime ? moment(updatedTime).format('hh:mm A') : group.lastMessageTime
            }
            : group
        ));
      }
    }
  };

  const handleMessageOperationSuccess = ({ status }: { status: 'edited' | 'deleted' }) => {
    if (status === "edited") {
      setEditMessage(null);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!groupId || !socket) return;

    setGroupedMessage({});
    setTypingUsers([]);
    setEditMessage(null);
    setActiveMenuId(null);

    socket.emit("join_group_chat", { groupId });

    socket.on("initial_group_messages", handleInitialLoad);
    socket.on('group_member_added', handleGroupMemberAdded);
    socket.on('group_member_removed', handleGroupMemberRemoved);
    socket.on("receive_group_message", handleNewGroupMessage);
    socket.on("new_edited_or_deleted_message", handleEditedOrDeletedMessage);
    socket.on("message_edited_or_deleted_successfully", handleMessageOperationSuccess);

    return () => {
      socket.off("initial_group_messages", handleInitialLoad);
      socket.off('group_member_added', handleGroupMemberAdded);
      socket.off("receive_group_message", handleNewGroupMessage);
      socket.off('group_member_removed', handleGroupMemberRemoved);
      socket.off("new_edited_or_deleted_message", handleEditedOrDeletedMessage);
      socket.off("message_edited_or_deleted_successfully", handleMessageOperationSuccess);
    };
  }, [groupId]);

  useEffect(() => {
    const socket = getSocket();
    if (!groupId || !socket) return;

    const handleUserTyping = ({ user, groupId: typingGroupId }: { user: { _id: string; name: string }; groupId: string }) => {
      if (typingGroupId === groupId && user._id !== userId) {
        setTypingUsers((prev) => [...new Set([...prev, user.name])]);
      }
    };

    const handleUserStoppedTyping = ({ user, groupId: typingGroupId }: { user: { name: string }; groupId: string }) => {
      if (typingGroupId === groupId) {
        setTypingUsers((prev) => prev.filter((name) => name !== user.name));
      }
    };

    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [groupId, userId]);

  const handleSendMessage = (content: string) => {
    const socket = getSocket();
    if (!socket || !groupId) return;
    socket.emit("send_group_message", {
      groupId: groupId,
      content: content,
    });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("edit_or_delete_message", {
      status: 'edited',
      messageId,
      newContent,
      groupId: groupId,
    });
  };

  const handleDeleteMessage = (status: 'deleted', messageId: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("edit_or_delete_message", {
      status,
      messageId,
      newContent: "",
      groupId: groupId,
    });
  };

  const handleStartTyping = () => {
    const socket = getSocket();
    if (!socket || !groupId) return;
    socket.emit('group_member_typing', { groupId: groupId });
  }

  const handleStopTyping = () => {
    const socket = getSocket();
    if (!socket || !groupId) return;
    socket.emit('group_member_stop_typing', { groupId: groupId });
  };

  return (
    <>
      <ChatHeader
        isGroup={true}
        totalMember={currentGroupDetails?.members?.length}
        setOpenChatInfo={setOpenChatInfo}
        currentChatDetails={currentGroupDetails}
      />
      <ChatWindow
        chatId={groupId}
        userId={userId}
        isGroup={true}
        isScrollBottom={isScrollBottom}
        groupedMessage={groupedMessage}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        setIsScrollBottom={setIsScrollBottom}
        setEditMessage={setEditMessage}
        editOrDeleteMessage={handleDeleteMessage}
        setGroupedMessage={setGroupedMessage}
        groupMessagesByDate={groupMessagesByDate}
        chatApiEndpoint={`/chat/messages/${groupId}`}
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

export default GroupChatContent;