import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import DatabaseGallery from "../../components/gallery/DatabaseGallery";
import PageHeader from "../../components/common/PageHeader";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getPageContent } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/gallery",
    {
      title: "DiveMix Gallery",
      description: "Browse projects, installations, and maintenance galleries from DiveMix.",
    },
    params.locale as Locale
  );
}

export default async function Gallery({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const pageData = await getPageContent("gallery", locale);

  return (
    <MainLayout locale={locale}>
      <div>
        <PageHeader
          title={pageData?.title || "Gallery"}
          description={
            pageData?.description ||
            "Experience our world-class facilities and installations through our curated collection of images"
          }
          backgroundImage={
            pageData?.hero_image ||
            "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000"
          }
        />
        <DatabaseGallery />
      </div>
    </MainLayout>
  );
}
