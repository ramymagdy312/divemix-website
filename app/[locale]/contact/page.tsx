import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ContactPageDB from "../../components/contact/ContactPageDB";
import MainLayout from "../../components/layout/MainLayout";
import { buildRouteMetadata } from "../../lib/metadata";
import { getContactPageData } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/contact",
    {
      title: "Contact DiveMix",
      description: "Get in touch with DiveMix experts for products and services.",
    },
    params.locale as Locale
  );
}

export default async function Contact({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const contactData = await getContactPageData(locale);

  return (
    <MainLayout locale={locale}>
      <ContactPageDB initialData={contactData as any} />
    </MainLayout>
  );
}
