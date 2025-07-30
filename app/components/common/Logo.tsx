import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/img/logoWhite.png" 
        alt="DiveMix Logo" 
        className="h-12 w-auto" // Increased from h-8 to h-12
      />
    </Link>
  );
};

export default Logo;