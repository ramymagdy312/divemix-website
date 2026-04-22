import type { Metadata } from "next";
import ContactPageDB from "../components/contact/ContactPageDB";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getContactPageData } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/contact", {
    title: "Contact DiveMix",
    description: "Get in touch with DiveMix experts for products and services.",
  });
}

export default async function Contact() {
  const contactData = await getContactPageData();

  return (
    <MainLayout>
      <ContactPageDB initialData={contactData as any} />
    </MainLayout>
  );
}
