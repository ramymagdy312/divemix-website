import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import AboutPageDB from "../../components/about/AboutPageDB";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getAboutPageData } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/about",
    {
      title: "About DiveMix",
      description:
        "Learn about DiveMix vision, mission, and journey in gas and compressor technologies.",
    },
    params.locale as Locale
  );
}

export default async function About({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const aboutData = await getAboutPageData(locale);

  return (
    <MainLayout locale={locale}>
      <AboutPageDB initialData={aboutData as any} />
    </MainLayout>
  );
}
