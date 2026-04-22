import type { Metadata } from "next";
import DatabaseGallery from "../components/gallery/DatabaseGallery";
import PageHeader from "../components/common/PageHeader";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getPageContent } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/gallery", {
    title: "DiveMix Gallery",
    description: "Browse projects, installations, and maintenance galleries from DiveMix.",
  });
}

export default async function Gallery() {
  const pageData = await getPageContent("gallery");

  return (
    <MainLayout>
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
