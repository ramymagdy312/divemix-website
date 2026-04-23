import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import CategoryList from "../../components/products/CategoryList";
import ProductsPageDB from "../../components/products/ProductsPageDB";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getActiveCategories, getPageContent } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

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

export default async function Products({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const [pageData, categories] = await Promise.all([
    getPageContent("products", locale),
    getActiveCategories(locale),
  ]);

  return (
    <MainLayout locale={locale}>
      <ProductsPageDB data={pageData}>
        <CategoryList initialCategories={categories as any} />
      </ProductsPageDB>
    </MainLayout>
  );
}
