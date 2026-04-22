import type { Metadata } from "next";
import HeroSection from "./components/home/HeroSection";
import CompanySection from "./components/home/CompanySection";
import FeaturedCategories from "./components/home/FeaturedCategories";
import FeaturedApplications from "./components/home/FeaturedApplications";
import StatsSection from "./components/home/StatsSection";
import ContactCTA from "./components/home/ContactCTA";
import FeaturedServices from "./components/home/FeaturedServices";
import VendorsSlider from "./components/home/VendorsSlider";
import MainLayout from "./components/layout/MainLayout";
import {
  getAboutPageData,
  getFeaturedApplications,
  getFeaturedCategories,
  getFeaturedServices,
  getHomeContent,
  getPageSeo,
  getVendors,
} from "./lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/");
  return {
    title: seo?.title || "DiveMix - Gas & Compressor Technologies",
    description:
      seo?.description ||
      "Leading the industry in compressed air and gas solutions since 1990",
    keywords: seo?.keywords || [],
    robots: seo?.noindex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: seo?.title || "DiveMix - Gas & Compressor Technologies",
      description:
        seo?.description ||
        "Leading the industry in compressed air and gas solutions since 1990",
      images: seo?.og_image ? [seo.og_image] : undefined,
      type: "website",
    },
  };
}

export default async function Home() {
  const [home, featuredCategories, featuredServices, featuredApplications, vendors, aboutData] =
    await Promise.all([
      getHomeContent(),
      getFeaturedCategories(),
      getFeaturedServices(),
      getFeaturedApplications(),
      getVendors(),
      getAboutPageData(),
    ]);

  return (
    <MainLayout>
      <div className="relative">
        <HeroSection
          title={home.hero_title}
          subtitle={home.hero_subtitle}
          image={home.hero_image}
          primaryCta={home.hero_cta_primary}
          secondaryCta={home.hero_cta_secondary}
        />

        {home.show_company_teaser && (
          <CompanySection companyOverview={aboutData?.company_overview || ""} />
        )}

        <FeaturedCategories initialCategories={featuredCategories as any} />
        <FeaturedServices initialServices={featuredServices as any} />
        <StatsSection stats={home.stats} />
        <FeaturedApplications initialApplications={featuredApplications as any} />
        <VendorsSlider initialVendors={vendors as any} />

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
