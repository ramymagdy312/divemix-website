"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { AlertCircle, ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import CategoryForm from "../../components/CategoryForm";
import { Button } from "@/app/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ProductCategory } from "../../../../types/database";
import { triggerRevalidate } from "@/app/lib/revalidate-client";

// Fallback category data for demo
const fallbackCategories: { [key: string]: ProductCategory } = {
  "1": {
    id: "1",
    name: "L&W Compressors",
    description: "Professional compressor equipment",
    slug: "lw-compressors",
    image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800",
    is_active: true,
    display_order: 1,
    parent_id: "",
    features: ["High performance", "Durable design"],
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "1-1": {
    id: "1-1",
    name: "Mobile Compressors",
    description: "Portable compressor solutions",
    slug: "mobile-compressors",
    image_url:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800",
    is_active: true,
    display_order: 1,
    parent_id: "1",
    features: ["Portable", "Easy to move"],
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "2": {
    id: "2",
    name: "INMATEC",
    description: "Advanced compressor technology",
    slug: "inmatec",
    image_url:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800",
    is_active: true,
    display_order: 2,
    parent_id: "",
    features: ["Advanced technology", "Energy efficient"],
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProductCategory | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCategory();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategory = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching category:", error);
        setError(`Database error: ${error.message}`);
        const fallbackCategory = fallbackCategories[params.id];
        if (fallbackCategory) {
          setInitialData(fallbackCategory);
          setUsingFallback(true);
        }
      } else {
        setInitialData(data);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(`Connection error: ${error.message}`);
      const fallbackCategory = fallbackCategories[params.id];
      if (fallbackCategory) {
        setInitialData(fallbackCategory);
        setUsingFallback(true);
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (categoryData: any) => {
    if (usingFallback) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("product_categories")
        .update(categoryData)
        .eq("id", params.id);

      if (error) {
        console.error("Error updating category:", error);
        toast.error(`Error updating category: ${error.message}`);
        return;
      }

      await triggerRevalidate(["categories"]);
      toast.success("Category updated successfully!");
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(`Error updating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-12">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Category Not Found</AlertTitle>
          <AlertDescription>
            The requested category could not be found.
          </AlertDescription>
        </Alert>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/check-products-database">
              <AlertCircle className="h-4 w-4 mr-2" />
              Check Database
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {error ? "Database Connection Issue" : "Demo Mode Active"}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {error ? (
                  <>Database error: {error}. Showing sample category data.</>
                ) : (
                  <>Editing sample category. Database not configured.</>
                )}
                <Link
                  href="/check-products-database"
                  className="underline ml-2"
                >
                  Set up database →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Categories
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="mt-2 text-gray-600">
          {usingFallback
            ? "Editing sample category (Demo Mode)"
            : "Edit category data"}
        </p>
        {initialData && (
          <div className="mt-2 text-sm text-gray-500">
            Category ID: {initialData.id} • {initialData.name}
          </div>
        )}
      </div>

      <CategoryForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
