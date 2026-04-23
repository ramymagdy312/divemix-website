import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ApplicationGridDB from "../../components/applications/ApplicationGridDB";
import ApplicationsPageDB from "../../components/applications/ApplicationsPageDB";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getApplications, getPageContent } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/applications",
    {
      title: "DiveMix Applications",
      description: "See how DiveMix solutions serve multiple industrial applications.",
    },
    params.locale as Locale
  );
}

export default async function Applications({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const [pageData, applications] = await Promise.all([
    getPageContent("applications", locale),
    getApplications(locale),
  ]);

  return (
    <MainLayout locale={locale}>
      <ApplicationsPageDB data={pageData}>
        <ApplicationGridDB initialApplications={applications as any} />
      </ApplicationsPageDB>
    </MainLayout>
  );
}
