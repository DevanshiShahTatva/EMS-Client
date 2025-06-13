import React, { useRef, useEffect, useState } from 'react';
import { SendHorizonalIcon, SmileIcon, XIcon, ImagePlus, Loader2 } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { IMessageInputProps } from './type';
import { apiCall } from '@/utils/services/request';
import { toast } from 'react-toastify';

interface ImageUploadState {
  file: File;
  preview: string;
  isUploading: boolean;
  uploadProgress: number;
}

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
  const [imageUpload, setImageUpload] = useState<ImageUploadState | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    return () => {
      if (imageUpload?.preview) {
        URL.revokeObjectURL(imageUpload.preview);
      }
    };
  }, [imageUpload?.preview]);

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
      onSendMessage(content, 'text');
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

  const handleImageIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    setImageUpload({
      file,
      preview,
      isUploading: true,
      uploadProgress: 0
    });

    const progressInterval = setInterval(() => {
      setImageUpload(prev => prev ? {
        ...prev,
        uploadProgress: Math.min(prev.uploadProgress + 10, 90)
      } : null);
    }, 100);

    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await apiCall({
        endPoint: '/chat/upload',
        method: 'POST',
        headers: {},
        isFormData: true,
        body: formData,
        withToken: true,
      });

      clearInterval(progressInterval);

      setImageUpload(prev => prev ? {
        ...prev,
        uploadProgress: 100
      } : null);

      const url = response.imageObj?.url;
      if (url) {
        onSendMessage(url, 'image');

        setTimeout(() => {
          setImageUpload(null);
          URL.revokeObjectURL(preview);
        }, 500);
      } else {
        throw new Error('No image URL received');
      }
    } catch (err) {
      console.log("Err:" + err);
      clearInterval(progressInterval);
      toast.error('Failed to upload image. Please try again.');

      setImageUpload(null);
      URL.revokeObjectURL(preview);
    }
    e.target.value = '';
  };

  const handleSendImageMessage = () => {
    if (imageUpload?.isUploading) return;
  };

  return (
    <div className='flex justify-center mb-2 md:mb-4'>
      <div className="w-full ml-4 mr-4 md:ml-16 md:mr-16 bg-white rounded-md shadow-sm relative">
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 mb-2 px-3 pt-2">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.join(', ')} are typing...`}
          </div>
        )}
        {imageUpload && (
          <div className="mx-3 mt-3 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={imageUpload.preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                {imageUpload.isUploading && (
                  <div className="absolute inset-0 bg-transparent bg-opacity-50 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {imageUpload.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(imageUpload.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {imageUpload.isUploading && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Uploading...</span>
                      <span className="text-xs text-gray-600">{imageUpload.uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${imageUpload.uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {!imageUpload.isUploading && (
                  <div className="mt-2">
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      ✓ Ready to send
                    </span>
                  </div>
                )}
              </div>
            </div>
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
          {!imageUpload && (
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
          )}
        </div>
        <div className="relative p-4 px-2 flex items-center justify-between">
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-50">
              <EmojiPicker
                width={300}
                height={350}
                onEmojiClick={onEmojiClick}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
          <div className='flex gap-5'>
            {!imageUpload && (
              <>
                <SmileIcon
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`text-gray-400 cursor-pointer hover:text-purple-500 ${showEmojiPicker && 'text-purple-500'}`}
                />
                <ImagePlus
                  onClick={handleImageIconClick}
                  className="text-gray-400 cursor-pointer hover:text-purple-500"
                />
              </>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <button
            onClick={() => imageUpload ? handleSendImageMessage() : sendMessage()}
            disabled={imageUpload ? imageUpload.isUploading : !newMessage.trim()}
            className="bg-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 text-white disabled:text-black p-2 rounded-full text-sm"
          >
            {imageUpload?.isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizonalIcon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;