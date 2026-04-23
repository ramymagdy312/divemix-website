import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CategoryDetailDB from "../../../components/products/CategoryDetailDB";
import MainLayout from "../../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../../lib/metadata";
import { getProductCategorySlugs } from "../../../lib/content";
import { isLocale, locales, type Locale } from "../../../lib/i18n/config";

export async function generateStaticParams() {
  const slugs = await getProductCategorySlugs();
  return locales.flatMap((locale) =>
    slugs.map((categoryId: string) => ({ locale, categoryId }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/products",
    {
      title: "DiveMix Products",
      description: "Explore DiveMix products for gas mixing and compression systems.",
    },
    params.locale as Locale
  );
}

export default function CategoryPage({
  params,
}: {
  params: { locale: string; categoryId: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  return (
    <MainLayout locale={locale}>
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
            </div>
          }
        >
          <CategoryDetailDB categoryId={params.categoryId} locale={locale} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
