import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ServiceGridDB from "../../components/services/ServiceGridDB";
import ServicesPageDB from "../../components/services/ServicesPageDB";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getPageContent, getServices } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/services",
    {
      title: "DiveMix Services",
      description: "Discover DiveMix maintenance, installation, and support services.",
    },
    params.locale as Locale
  );
}

export default async function Services({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const [pageData, services] = await Promise.all([
    getPageContent("services", locale),
    getServices(locale),
  ]);

  return (
    <MainLayout locale={locale}>
      <ServicesPageDB data={pageData}>
        <ServiceGridDB initialServices={services as any} />
      </ServicesPageDB>
    </MainLayout>
  );
}
