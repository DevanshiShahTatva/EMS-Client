"use client"
import React, { ReactNode } from 'react'

import { usePathname } from 'next/navigation';

// custom componetns
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {

    const path = usePathname()

  return (
      <div>
          <Header activeLink={path} />
          <main className='bg-gray-100'>
              {children}
          </main>
          <Footer />
      </div>
  );
}

export default Layout