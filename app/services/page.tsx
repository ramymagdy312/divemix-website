import type { Metadata } from "next";
import ServiceGridDB from "../components/services/ServiceGridDB";
import ServicesPageDB from "../components/services/ServicesPageDB";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getPageContent, getServices } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/services", {
    title: "DiveMix Services",
    description: "Discover DiveMix maintenance, installation, and support services.",
  });
}

export default async function Services() {
  const [pageData, services] = await Promise.all([
    getPageContent("services"),
    getServices(),
  ]);

  return (
    <MainLayout>
      <ServicesPageDB data={pageData}>
        <ServiceGridDB initialServices={services as any} />
      </ServicesPageDB>
    </MainLayout>
  );
}
