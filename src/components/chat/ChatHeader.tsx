import React from 'react';
import { ArrowLeft, InfoIcon } from "lucide-react";
import { IChatHeaderProps } from './type';

const ChatHeader: React.FC<IChatHeaderProps> = ({
  isGroup,
  totalMember,
  currentChatDetails,
  setOpenChatInfo,
  onBackToListPage
}) => {
  if (!currentChatDetails) return;

  const displayName = currentChatDetails.name;
  const displayImage = currentChatDetails.image;

  return (
    <div className="p-2 md:p-4 md:pt-[7px] md:pb-[13px] bg-white border-b border-gray-200 flex items-center">
      <button
        onClick={() => onBackToListPage()}
        className='mr-2 md:hidden cursor-pointer'
      >
        <ArrowLeft />
      </button>
      <div className='flex justify-between w-full'>
        <div className="flex items-center gap-3">
          {displayImage ? (
            <img src={displayImage} alt={displayName} className="w-10 h-10 min-w-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
              {displayName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">
              {displayName}
            </div>
            {isGroup && <div className="text-xs text-green-500">{totalMember} Member{(totalMember ?? 0) > 1 && "s"}</div>}
          </div>
        </div>
        {isGroup && (
          <button
            onClick={() => setOpenChatInfo(prev => !prev)}
            className="p-0 pl-2 md:p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <InfoIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;