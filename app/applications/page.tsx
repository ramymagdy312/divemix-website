import type { Metadata } from "next";
import ApplicationGridDB from "../components/applications/ApplicationGridDB";
import ApplicationsPageDB from "../components/applications/ApplicationsPageDB";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getApplications, getPageContent } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/applications", {
    title: "DiveMix Applications",
    description: "See how DiveMix solutions serve multiple industrial applications.",
  });
}

export default async function Applications() {
  const [pageData, applications] = await Promise.all([
    getPageContent("applications"),
    getApplications(),
  ]);

  return (
    <MainLayout>
      <ApplicationsPageDB data={pageData}>
        <ApplicationGridDB initialApplications={applications as any} />
      </ApplicationsPageDB>
    </MainLayout>
  );
}
