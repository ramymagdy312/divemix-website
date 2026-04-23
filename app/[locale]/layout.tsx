import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { isLocale, isRtl, locales, type Locale } from "@/app/lib/i18n/config";
import { getLanguageSettings } from "@/app/lib/i18n/languages";
import { LanguagesProvider } from "@/app/lib/i18n/LanguagesProvider";
import { SetHtmlDocument } from "@/app/components/SetHtmlDocument";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  icons: {
    icon: "/img/faveicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) {
    notFound();
  }

  // Respect the admin's enable/disable configuration. If the requested
  // locale has been disabled, redirect to the configured default locale.
  // This complements the redirect done in middleware (defense-in-depth,
  // also covers cases where the edge cache lagged behind).
  const languages = await getLanguageSettings();
  if (!languages.enabled.includes(locale)) {
    redirect(`/${languages.default}`);
  }

  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  // RTL: prefer the DB-configured flag (supports future locales without
  // code changes); fall back to the static list for build-time safety.
  const isRtlLocale =
    languages.rtl.includes(locale) || isRtl(locale as Locale);
  const dir = isRtlLocale ? "rtl" : "ltr";

  return (
    <>
      <SetHtmlDocument
        lang={locale}
        dir={dir}
        className={locale === "ar" ? "font-arabic" : ""}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LanguagesProvider initialSnapshot={languages}>
          {children}
        </LanguagesProvider>
      </NextIntlClientProvider>
      <Toaster
        position={dir === "rtl" ? "top-left" : "top-right"}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </>
  );
}
