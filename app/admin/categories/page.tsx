"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Search, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
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
} from '@/app/components/ui/alert-dialog';


interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

// Fallback categories for demo mode
const fallbackCategories: Category[] = [
  {
    id: '1',
    name: 'Diving Equipment',
    description: 'Professional diving gear and equipment for all levels of divers',
    slug: 'diving-equipment',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Safety Gear',
    description: 'Essential safety equipment for underwater activities and diving',
    slug: 'safety-gear',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Underwater Cameras',
    description: 'Capture your underwater adventures with professional cameras',
    slug: 'underwater-cameras',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Essential accessories for diving and underwater activities',
    slug: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Wetsuits & Gear',
    description: 'High-quality wetsuits and thermal protection gear',
    slug: 'wetsuits-gear',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Maintenance Tools',
    description: 'Tools and equipment for maintaining your diving gear',
    slug: 'maintenance-tools',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString()
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setError(`Database error: ${error.message}`);
        setCategories(fallbackCategories);
        setUsingFallback(true);
      } else {
        setCategories(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
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
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {error ? 'Database Connection Issue' : 'Demo Mode Active'}
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
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">
            {usingFallback ? 'Managing sample categories (Demo Mode)' : 'Managing all company categories'}
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
            {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : 'y'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {category.image_url && (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {category.description}
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
                    <Badge variant="secondary">
                      {category.name || 'No Category'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "default" : "destructive"}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.display_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild disabled={usingFallback}>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={usingFallback}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the category "{category.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No categories found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new category.'}
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