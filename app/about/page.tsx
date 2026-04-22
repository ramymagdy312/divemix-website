import type { Metadata } from "next";
import AboutPageDB from "../components/about/AboutPageDB";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getAboutPageData } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/about", {
    title: "About DiveMix",
    description: "Learn about DiveMix vision, mission, and journey in gas and compressor technologies.",
  });
}

export default async function About() {
  const aboutData = await getAboutPageData();

  return (
    <MainLayout>
      <AboutPageDB initialData={aboutData as any} />
    </MainLayout>
  );
}
