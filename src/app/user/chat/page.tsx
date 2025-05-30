"use client";

import React from 'react';
import Chat from '@/components/chat/Chat';

function UserChat() {
  return (
    <div className='min-h-[calc(100vh-77px)] max-h-[calc(100vh-77px)] w-full flex bg-[#f5f5fa] text-sm'>
      <Chat />
    </div>
  )
}

export default UserChat;