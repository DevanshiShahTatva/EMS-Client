"use client";
import React, { ReactNode } from 'react'
import Header from '@/components/common/Header';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {
  return (
    <div>
      <Header />
      <main className="bg-gray-100 min-h-[calc(100vh-82px)]">{children}</main>
    </div>
  );
}

export default Layout