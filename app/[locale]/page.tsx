import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HeroSection from "../components/home/HeroSection";
import CompanySection from "../components/home/CompanySection";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedApplications from "../components/home/FeaturedApplications";
import StatsSection from "../components/home/StatsSection";
import ContactCTA from "../components/home/ContactCTA";
import FeaturedServices from "../components/home/FeaturedServices";
import VendorsSlider from "../components/home/VendorsSlider";
import MainLayout from "../components/layout/MainLayout";
import {
  getAboutPageData,
  getFeaturedApplications,
  getFeaturedCategories,
  getFeaturedServices,
  getHomeContent,
  getVendors,
} from "../lib/content";
import { buildRouteMetadata } from "../lib/metadata";
import { isLocale, type Locale } from "../lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildRouteMetadata(
    "/",
    {
      title: "DiveMix - Gas & Compressor Technologies",
      description: "Leading the industry in compressed air and gas solutions since 1990",
    },
    params.locale as Locale
  );
}

export default async function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const [home, featuredCategories, featuredServices, featuredApplications, vendors, aboutData] =
    await Promise.all([
      getHomeContent(locale),
      getFeaturedCategories(locale),
      getFeaturedServices(locale),
      getFeaturedApplications(locale),
      getVendors(locale),
      getAboutPageData(locale),
    ]);

  return (
    <MainLayout locale={locale}>
      <div className="relative">
        <HeroSection
          title={home.hero_title}
          subtitle={home.hero_subtitle}
          image={home.hero_image}
          primaryCta={home.hero_cta_primary}
          secondaryCta={home.hero_cta_secondary}
        />

        {home.show_company_teaser && (
          <CompanySection companyOverview={(aboutData as any)?.company_overview || ""} />
        )}

        <FeaturedCategories initialCategories={featuredCategories as any} />
        <FeaturedServices initialServices={featuredServices as any} />
        <StatsSection stats={home.stats} />
        <FeaturedApplications initialApplications={featuredApplications as any} />
        <VendorsSlider
          initialVendors={vendors as any}
          heading={home.vendors_section_title}
          description={home.vendors_section_description}
        />

        {home.show_contact_cta && (
          <ContactCTA
            title={home.contact_cta_title}
            body={home.contact_cta_body}
            button={home.contact_cta_button}
          />
        )}
      </div>
    </MainLayout>
  );
}
