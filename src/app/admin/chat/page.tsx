"use client";

import Chat from '@/components/chat/Chat';
import React from 'react';

function AdminChat() {
  return (
    <div className='min-h-[calc(100vh-81px)] max-h-[calc(100vh-81px)] w-full flex bg-[#f5f5fa] text-sm p-3'>
      <Chat />
    </div>
  )
}

export default AdminChat;