'use client'

import React, { Suspense } from 'react';
import Chat from '@/components/chat/ChatLayout';

const AdminChat = () => {
  return (
    <div className='min-h-[calc(100vh-81px)] max-h-[calc(100vh-81px)] w-full flex bg-[#f5f5fa] text-sm p-3'>
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
    </Suspense>
    </div>
  )
}

export default AdminChat;