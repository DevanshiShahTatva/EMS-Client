import React from 'react'
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <Image
        src="/assets/Loader.gif"
        alt="loading"
        width={100}
        height={100}
        unoptimized
      />
    </div>
  );
}

export default Loader