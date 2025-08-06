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

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  image_url?: string;
  price?: number;
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  product_categories?: {
    name: string;
  };
}

// Fallback products data
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Diving Mask',
    description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt',
    short_description: 'Crystal clear vision underwater',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',

    features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    product_categories: { name: 'Diving Equipment' }
  },
  {
    id: '2',
    name: 'Diving Fins',
    description: 'Lightweight and efficient diving fins for better propulsion',
    short_description: 'Enhanced underwater mobility',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',

    features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'],
    is_active: true,
    display_order: 2,
    created_at: '2024-01-02T00:00:00Z',
    product_categories: { name: 'Diving Equipment' }
  },
  {
    id: '3',
    name: 'Underwater Safety Light',
    description: 'Bright LED safety light for underwater visibility',
    short_description: 'Stay visible and safe underwater',
    category_id: '2',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',

    features: ['Waterproof to 100m', 'Long battery life', 'Multiple flash modes'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-03T00:00:00Z',
    product_categories: { name: 'Safety Gear' }
  },
  {
    id: '4',
    name: 'Waterproof Action Camera',
    description: '4K underwater action camera with stabilization',
    short_description: 'Capture stunning underwater footage',
    category_id: '3',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',

    features: ['4K video recording', 'Image stabilization', 'Waterproof to 30m'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-04T00:00:00Z',
    product_categories: { name: 'Underwater Cameras' }
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError(`Database error: ${error.message}`);
        setProducts(fallbackProducts);
        setUsingFallback(true);
      } else {
        setProducts(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      setProducts(fallbackProducts);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (usingFallback) {
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Product deleted successfully!');
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(`Error deleting product: ${error.message}`);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
              <>Database error: {error}. Showing sample products.</>
            ) : (
              <>Showing sample products. Database not configured.</>
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
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            {usingFallback ? 'Managing sample products (Demo Mode)' : 'Managing all company products'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={usingFallback ? "destructive" : "secondary"}>
            <Package className="h-3 w-3 mr-1" />
            {usingFallback ? "Demo Mode" : "Live"}
          </Badge>
          <Button asChild disabled={usingFallback}>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {product.description}
                        </div>
                        {usingFallback && (
                          <Badge variant="outline" className="mt-1">
                            Demo Product
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.product_categories?.name || 'No Category'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "destructive"}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.features && product.features.length > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {product.features.length} feature{product.features.length !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No features</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild disabled={usingFallback}>
                        <Link href={`/admin/products/${product.id}/edit`}>
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
                              This action cannot be undone. This will permanently delete the product "{product.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(product.id)}>
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new product.'}
              </p>
              {!usingFallback && !searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
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