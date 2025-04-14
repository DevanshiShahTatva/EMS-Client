"use client";
import React, { ReactNode, useState } from 'react'
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

const layout : React.FC<{children : ReactNode}> = ( { children }) => {

    const pathname = usePathname();

  return (
    <div>
      <Header isAdmiRole/>
         <main className='bg-gray-100 min-h-[calc(100vh-82px)]'>
            {children}
         </main>
    </div>
  );
}

export default layout