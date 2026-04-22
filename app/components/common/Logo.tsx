import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  src?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ src = '/img/logoWhite.png', alt = 'DiveMix Logo' }) => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src={src}
        alt={alt}
        width={200}
        height={80}
        className="h-16 sm:h-20 w-auto transition-all duration-200"
      />
    </Link>
  );
};

export default Logo;
