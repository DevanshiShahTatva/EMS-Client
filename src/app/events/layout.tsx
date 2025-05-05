"use client";
import React, { ReactNode } from 'react'
import Header from '@/components/common/Header';
import { usePathname } from 'next/navigation';
import Footer from '@/components/common/Footer';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {

  const path = usePathname()

  return (
    <div>
      <Header activeLink={path}/>
      <main className="bg-gray-100 min-h-[calc(100vh-82px)]">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout