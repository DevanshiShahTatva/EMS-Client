import React from 'react';
import { InfoIcon } from "lucide-react";
import { IChatHeaderProps } from './type';

const ChatHeader: React.FC<IChatHeaderProps> = ({
  isGroup,
  currentChatDetails,
  setOpenChatInfo
}) => {
  if (!currentChatDetails) return;

  const displayName = currentChatDetails.name;
  const displayImage = currentChatDetails.image;

  return (
    <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {displayImage ? (
          <img src={displayImage} alt={displayName} className="w-10 h-10 min-w-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="font-semibold text-lg">{displayName}</div>
      </div>
      {isGroup && (
        <button
          onClick={() => setOpenChatInfo(prev => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <InfoIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;