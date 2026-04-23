"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-cyan-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("title")}</h2>
        <p className="text-gray-600 mb-8">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
