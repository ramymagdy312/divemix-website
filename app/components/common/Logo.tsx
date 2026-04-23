import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { defaultLocale, type Locale } from '@/app/lib/i18n/config';

interface LogoProps {
  src?: string;
  alt?: string;
  locale?: Locale;
}

const Logo: React.FC<LogoProps> = ({
  src = '/img/logoWhite.png',
  alt = 'DiveMix Logo',
  locale = defaultLocale,
}) => {
  return (
    <Link href="/" locale={locale} className="flex items-center space-x-2">
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
