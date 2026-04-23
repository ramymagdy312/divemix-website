"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  Package,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { ProductCategory } from "../../types/database";
import { resolveI18n } from "@/app/lib/i18n/resolve";
import { defaultLocale } from "@/app/lib/i18n/config";

interface CategoryWithSubcategories extends ProductCategory {
  subcategories?: ProductCategory[];
}

// Fallback categories for demo mode
const fallbackCategories: CategoryWithSubcategories[] = [
  {
    id: "1",
    name: "L&W Compressors",
    description: "Professional compressor equipment",
    slug: "lw-compressors",
    image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    parent_id: "",
    features: ["High performance", "Durable design"],
    images: [],
    updated_at: new Date().toISOString(),
    subcategories: [
      {
        id: "1-1",
        name: "Mobile Compressors",
        description: "Portable compressor solutions",
        slug: "mobile-compressors",
        image_url:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800",
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        parent_id: "1",
        features: ["Portable", "Easy to move"],
        images: [],
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "INMATEC",
    description: "Advanced compressor technology",
    slug: "inmatec",
    image_url:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    parent_id: "",
    features: ["Advanced technology", "Energy efficient"],
    images: [],
    updated_at: new Date().toISOString(),
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch parent categories with their subcategories
      const { data: parentCategories, error: parentError } = await supabase
        .from("product_categories")
        .select("*")
        .is("parent_id", null)
        .order("display_order", { ascending: true });

      if (parentError) {
        console.error("Error fetching parent categories:", parentError);
        setError(`Database error: ${parentError.message}`);
        setCategories(fallbackCategories);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      // Fetch all subcategories
      const { data: subcategories, error: subError } = await supabase
        .from("product_categories")
        .select("*")
        .not("parent_id", "is", null)
        .order("display_order", { ascending: true });

      if (subError) {
        console.error("Error fetching subcategories:", subError);
      }

      // Combine parent categories with their subcategories
      const categoriesWithSubs = (parentCategories || []).map((parent) => ({
        ...parent,
        subcategories: (subcategories || []).filter(
          (sub) => sub.parent_id === parent.id
        ),
      }));

      setCategories(categoriesWithSubs);
      setUsingFallback(false);
    } catch (error: any) {
      console.error("Error:", error);
      setError(`Connection error: ${error.message}`);
      setCategories(fallbackCategories);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (usingFallback) {
      return;
    }

    try {
      // First delete all subcategories
      const { error: subError } = await supabase
        .from("product_categories")
        .delete()
        .eq("parent_id", id);

      if (subError) {
        console.error("Error deleting subcategories:", subError);
        // Continue with deleting parent even if subcategories deletion fails
      }

      // Then delete the category itself
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category and its subcategories deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const q = searchTerm.toLowerCase();
    const n = resolveI18n(category.name as any, defaultLocale).toLowerCase();
    const d = resolveI18n(category.description as any, defaultLocale).toLowerCase();
    if (n.includes(q) || d.includes(q)) return true;
    return category.subcategories?.some((sub) => {
      const sn = resolveI18n(sub.name as any, defaultLocale).toLowerCase();
      const sd = resolveI18n(sub.description as any, defaultLocale).toLowerCase();
      return sn.includes(q) || sd.includes(q);
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error ? "Database Connection Issue" : "Demo Mode Active"}
          </AlertTitle>
          <AlertDescription>
            {error ? (
              <>Database error: {error}. Showing sample categories.</>
            ) : (
              <>Showing sample categories. Database not configured.</>
            )}
            <Link href="/check-products-database" className="underline ml-2">
              Set up database →
            </Link>
          </AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-muted-foreground">
            {usingFallback
              ? "Managing sample categories (Demo Mode)"
              : "Managing all company categories"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={usingFallback ? "destructive" : "secondary"}>
            <Package className="h-3 w-3 mr-1" />
            {usingFallback ? "Demo Mode" : "Live"}
          </Badge>
          <Button asChild disabled={usingFallback}>
            <Link href="/admin/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            {filteredCategories.length} main categor
            {filteredCategories.length !== 1 ? "ies" : "y"} found
            {filteredCategories.reduce(
              (total, cat) => total + (cat.subcategories?.length || 0),
              0
            ) > 0 &&
              ` with ${filteredCategories.reduce(
                (total, cat) => total + (cat.subcategories?.length || 0),
                0
              )} subcategories`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <>
                  {/* Parent Category Row */}
                  <TableRow key={category.id} className="bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {category.image_url && (
                          <Image
                            src={category.image_url}
                            alt={resolveI18n(category.name as any, defaultLocale)}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <div className="font-medium flex items-center">
                            <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                            {resolveI18n(category.name as any, defaultLocale)}
                          </div>
                          <div className="text-sm text-muted-foreground max-w-md truncate">
                            {resolveI18n(category.description as any, defaultLocale)}
                          </div>
                          {usingFallback && (
                            <Badge variant="outline" className="mt-1">
                              Demo Category
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Main Category</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {category.features?.slice(0, 2).map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {resolveI18n(feature as any, defaultLocale)}
                          </Badge>
                        ))}
                        {category.features && category.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.is_active ? "default" : "destructive"}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{category.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          disabled={usingFallback}
                        >
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={usingFallback}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the category &quot;{resolveI18n(category.name as any, defaultLocale)}
                                &quot; and all its subcategories.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategory(category.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Subcategory Rows */}
                  {category.subcategories &&
                    category.subcategories.map((subcategory) => (
                      <TableRow key={subcategory.id} className="bg-gray-25">
                        <TableCell>
                          <div className="flex items-center space-x-3 ml-8">
                            <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl"></div>
                            {subcategory.image_url && (
                              <Image
                                src={subcategory.image_url}
                                alt={resolveI18n(subcategory.name as any, defaultLocale)}
                                width={32}
                                height={32}
                                className="h-8 w-8 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {resolveI18n(subcategory.name as any, defaultLocale)}
                              </div>
                              <div className="text-sm text-muted-foreground max-w-md truncate">
                                {resolveI18n(subcategory.description as any, defaultLocale)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Subcategory</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {subcategory.features
                              ?.slice(0, 2)
                              .map((feature, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {resolveI18n(feature as any, defaultLocale)}
                                </Badge>
                              ))}
                            {subcategory.features &&
                              subcategory.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{subcategory.features.length - 2} more
                                </Badge>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              subcategory.is_active ? "default" : "destructive"
                            }
                          >
                            {subcategory.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{subcategory.display_order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              disabled={usingFallback}
                            >
                              <Link
                                href={`/admin/categories/${subcategory.id}/edit`}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={usingFallback}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the subcategory &quot;
                                    {resolveI18n(subcategory.name as any, defaultLocale)}&quot;.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteCategory(subcategory.id)
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">
                No categories found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating a new category."}
              </p>
              {!usingFallback && !searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/categories/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Category
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
