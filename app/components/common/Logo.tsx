import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/img/logoWhite.png" 
        alt="DiveMix Logo" 
        width={200}
        height={80}
        className="h-16 sm:h-20 w-auto transition-all duration-200" // Responsive sizing
      />
    </Link>
  );
};

export default Logo;