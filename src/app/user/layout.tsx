"use client"
import React, { ReactNode } from 'react'

// custom componetns
import Footer from '@/components/common/Footer';
import CommonUserLayout from '@/components/common/CommonUserLayout';

// constant
import { ROLE } from '@/utils/constant';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {

  return (
      <div>
          <CommonUserLayout role={ROLE.User}>
              {children}
              <Footer />
          </CommonUserLayout>
      </div>
  );
}

export default Layout