"use client";
import React, { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation';

// custom componetns
import Header from '@/components/common/Header';
import Sidebar from '@/components/admin-components/Sidebar';

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
      <Header toggleSidebar={toggleSidebar} isAdmiRole/>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} activeLink={pathname}>
         <main className='bg-gray-100 min-h-[calc(100vh-82px)]'>
            {children}
         </main>
      </Sidebar>
    </div>
  );
}

export default Layout