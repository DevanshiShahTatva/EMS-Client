"use client";
import React, { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation';

// custom componetns
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';

// Constant
import { ROLE } from '@/utils/constant';

interface CommonUserLayoutProps {
    children : ReactNode
    role : ROLE.Admin | ROLE.User | ROLE.Organizer,
}

const CommonUserLayout : React.FC<CommonUserLayoutProps> = ( { role, children }) => {

    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const adminRoleType = role === ROLE.Admin ? true : false
    const organizerRoleType = role === ROLE.Organizer ? true : false


  return (
    <div>
      <Header toggleSidebar={toggleSidebar} isAdmiRole={adminRoleType} isStaffRole={organizerRoleType} />
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={closeSidebar} activeLink={pathname}>
         <main className={`bg-gray-100 min-h-[calc(100vh-82px)] ${isSidebarOpen ? "hidden" : "block"}`}>
            {children}
         </main>
      </Sidebar>
    </div>
  );
}

export default CommonUserLayout