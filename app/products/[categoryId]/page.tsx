import type { Metadata } from "next";
import CategoryDetailDB from "../../components/products/CategoryDetailDB";
import MainLayout from "../../components/layout/MainLayout";
import { Suspense } from "react";
import { buildRouteMetadata } from "../../lib/metadata";
import { getProductCategorySlugs } from "../../lib/content";

export async function generateStaticParams() {
  const slugs = await getProductCategorySlugs();
  return slugs.map((categoryId) => ({ categoryId }));
}

export async function generateMetadata(): Promise<Metadata> {
  return buildRouteMetadata("/products", {
    title: "DiveMix Products",
    description: "Explore DiveMix products for gas mixing and compression systems.",
  });
}

export default function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
            </div>
          }
        >
          <CategoryDetailDB categoryId={params.categoryId} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
