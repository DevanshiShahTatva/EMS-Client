"use client";
import React, { ReactNode, useState, useEffect } from 'react'
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
    const [collapseSidebar, setCollapseSidebar] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const handleCollapse = () => {
        setCollapseSidebar(!collapseSidebar)
    }

    const adminRoleType = role === ROLE.Admin ? true : false
    const organizerRoleType = role === ROLE.Organizer ? true : false

    useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleResize = () => {
      if (mediaQuery.matches) {
        setCollapseSidebar(false); // force collapse off on small screens
      } 
    };

    handleResize(); // initial check
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);


  return (
    <div>
      <Header activeLink={pathname} collapseSidebar={handleCollapse} toggleSidebar={toggleSidebar} isAdmiRole={adminRoleType} isStaffRole={organizerRoleType} />
      <Sidebar role={role} isOpen={isSidebarOpen} isCollase={collapseSidebar} onClose={closeSidebar} activeLink={pathname}>
         <main className={`flex flex-col justify-between bg-gray-100 min-h-[calc(100vh-82px)] ${isSidebarOpen ? "hidden" : "block"}`}>
            {children}
         </main>
      </Sidebar>
    </div>
  );
}

export default CommonUserLayout