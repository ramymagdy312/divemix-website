import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/app/lib/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  if (!isLocale(requested)) {
    notFound();
  }

  const messages = (await import(`../messages/${requested}.json`)).default;

  return {
    locale: requested,
    messages,
  };
});
