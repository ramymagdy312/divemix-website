import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/img/logoWhite.png" 
        alt="DiveMix Logo" 
        width={160}
        height={64}
        className="h-16 w-auto" // Increased from h-12 to h-16
      />
    </Link>
  );
};

export default Logo;