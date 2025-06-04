"use client"
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation';

// custom componetns
import Footer from '@/components/common/Footer';
import CommonUserLayout from '@/components/common/CommonUserLayout';

// constant
import { ROLE } from '@/utils/constant';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {
    const pathname = usePathname();
    const shouldHideFooter = pathname.includes('/user/chat');

  return (
      <div>
          <CommonUserLayout role={ROLE.User}>
              {children}
              {!shouldHideFooter && <Footer />}
          </CommonUserLayout>
      </div>
  );
}

export default Layout