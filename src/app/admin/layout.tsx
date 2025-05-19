"use client";
import React, { ReactNode } from 'react'

// custom componetns
import CommonUserLayout from '@/components/common/CommonUserLayout';

// Constant
import { ROLE } from '@/utils/constant';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {
  return (
    <div>
      <CommonUserLayout role={ROLE.Admin}>
          {children}
      </CommonUserLayout>
    </div>
  );
}

export default Layout