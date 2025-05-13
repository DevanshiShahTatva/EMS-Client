"use client";
import React, { ReactNode, useState } from 'react'

import { usePathname } from 'next/navigation';

// Custom components
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';

// Constant
import { ROLE } from '@/utils/constant';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {

  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} isStaffRole />
      <Sidebar role={ROLE.Organizer} isOpen={isSidebarOpen} onClose={closeSidebar} activeLink={pathname}>
        <main className='bg-gray-100 min-h-[calc(100vh-82px)]'>
          {children}
        </main>
      </Sidebar>
    </div>
  );
}

export default Layout