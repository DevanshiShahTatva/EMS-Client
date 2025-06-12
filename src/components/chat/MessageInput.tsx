import React, { useRef, useEffect, useState } from 'react';
import { Send, SendHorizonalIcon, SmileIcon, XIcon } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { IMessageInputProps } from './type';

const MessageInput: React.FC<IMessageInputProps> = ({
  typingUsers,
  editMessage,
  onSendMessage,
  onEditMessage,
  onStartTyping,
  onStopTyping,
  setEditMessage,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editMessage) {
      setNewMessage(editMessage.content);
    } else {
      setNewMessage("");
    }
  }, [editMessage]);

  const handleInternalTyping = (action: string) => {
    if (action === "start") {
      if (!typingTimeoutRef.current) {
        onStartTyping();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
        typingTimeoutRef.current = null;
      }, 1000);
    } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      onStopTyping();
    }
  };

  const onInputChange = (value: string) => {
    setNewMessage(value);

    if (value.length > 0) {
      handleInternalTyping("start");
    } else {
      handleInternalTyping("stop");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCancelEdit = () => {
    setEditMessage(null);
    setNewMessage("");
  };

  const sendMessage = () => {
    const content = newMessage.trim();
    if (!content) return;

    if (editMessage) {
      onEditMessage(editMessage._id, content);
    } else {
      onSendMessage(content);
    }
    setNewMessage("");
    setEditMessage(null);
    handleInternalTyping("stop");
  };

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const emoji = emojiData.emoji;

    setNewMessage((prevMessage) => {
      const text = prevMessage;
      const start = text.substring(0, cursorPosition);
      const end = text.substring(cursorPosition);
      const updatedText = start + emoji + end;

      const newCursorPos = start.length + emoji.length;

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
        }
      }, 0);

      setCursorPosition(newCursorPos);
      return updatedText;
    });

    setShowEmojiPicker(false);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value); 
  
    const textarea = e.target;
    textarea.style.height = 'auto'; 
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className='flex justify-center mb-2 md:mb-4'>
      <div className="w-full ml-4 mr-4 md:ml-16 md:mr-16 bg-white rounded-md shadow-sm relative">
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 mb-2">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.join(', ')} are typing...`}
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
                  onClick={() => handleCancelEdit()}
                />
              </button>
            </div>
          )}
          <div className={`flex`}>
          <textarea
            ref={textareaRef}
            value={newMessage}
            placeholder="Enter your message here"
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={handleInput}
            onSelect={handleSelect}
            className="w-full flex-1 border-none outline-none text-gray-700 resize-none peer py-3 px-3 placeholder-gray-400 overflow-hidden"
            rows={1}
          />
          </div>
        </div>
        <div className="relative p-4 px-2 flex items-center justify-between">
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-99">
              <EmojiPicker
                width={300}
                height={350}
                onEmojiClick={onEmojiClick}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
          <SmileIcon
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`text-gray-400 cursor-pointer hover:text-purple-500 ${showEmojiPicker && 'text-purple-500'}`}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!newMessage.trim()}
            className="bg-blue-500 cursor-pointer disabled:cursor-not-allowed  disabled:bg-gray-200 text-white disabled:text-black p-2 rounded-full text-sm"
          >
            <SendHorizonalIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;