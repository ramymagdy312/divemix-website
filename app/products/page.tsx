import type { Metadata } from "next";
import CategoryList from "../components/products/CategoryList";
import ProductsPageDB from "../components/products/ProductsPageDB";
import MainLayout from "../components/layout/MainLayout";
import { buildRouteMetadata } from "../lib/metadata";
import { getActiveCategories, getPageContent } from "../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/products", {
    title: "DiveMix Products",
    description: "Explore DiveMix products for gas mixing and compression systems.",
  });
}

export default async function Products() {
  const [pageData, categories] = await Promise.all([
    getPageContent("products"),
    getActiveCategories(),
  ]);

  return (
    <MainLayout>
      <ProductsPageDB data={pageData}>
        <CategoryList initialCategories={categories as any} />
      </ProductsPageDB>
    </MainLayout>
  );
}
