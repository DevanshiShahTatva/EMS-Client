'use client'

import React, { Suspense } from 'react';
import Chat from '@/components/chat/ChatLayout';

const UserChat = () => {
  return (
    <div className='min-h-[calc(100vh-77px)] max-h-[calc(100vh-77px)] w-full flex bg-[#f5f5fa] text-sm'>
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
    </Suspense>
    </div>
  )
}

export default UserChat;