"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import ProductDetail from "./ProductDetail";
import SearchBar from "./SearchBar";
import { useSearch } from "../../hooks/useSearch";
import AnimatedElement from "../common/AnimatedElement";
import EnhancedLoader from "../common/EnhancedLoader";
import StatsCounter from "../common/StatsCounter";
import FilterTabs from "../common/FilterTabs";
import QuickNavigation from "../common/QuickNavigation";
import ProductModal from "./ProductModal";
import ProductFilters from "./ProductFilters";
import ProductInsights from "./ProductInsights";
import ProductNavigation from "./ProductNavigation";
import { Package, Filter, Grid, List, Search as SearchIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  image_url?: string;
  images?: string[];
  category_id?: string;
  category?: string;
  features?: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductListDBProps {
  categoryId: string;
}

const ProductListDB: React.FC<ProductListDBProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'order'>('order');
  const [categoryInfo, setCategoryInfo] = useState<{name: string, description?: string} | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeatureFilters, setSelectedFeatureFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, [
    "name",
    "description",
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      // First try to get category by slug or ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('id, slug, name, description')
        .eq('slug', categoryId)
        .single();

      if (categoryError || !categoryData) {
        console.log('Category not found in database:', categoryError);
        setError('Category not found');
        setProducts([]);
        setLoading(false);
        return;
      }

      setCategoryInfo({
        name: categoryData.name,
        description: categoryData.description
      });

      // Then get products by category_id
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      
      // If no products found, this is not an error, just empty results
      if (!data || data.length === 0) {
        console.log('No products found for category:', categoryId);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply feature filters
  const featureFilteredProducts = selectedFeatureFilters.length > 0 
    ? filteredItems.filter(product => 
        selectedFeatureFilters.some(filter => 
          product.features?.some(feature => feature.includes(filter))
        )
      )
    : filteredItems;

  // Sort products based on selected criteria
  const sortedProducts = [...featureFilteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.display_order - b.display_order;
  });

  // Get all unique features for filtering
  const allFeatures = products.reduce((acc, product) => {
    if (product.features) {
      acc.push(...product.features);
    }
    return acc;
  }, [] as string[]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFeatureFilters]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <EnhancedLoader message="Loading products..." variant="dots" size="lg" />;
  }
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      {products.length > 0 && (
        <AnimatedElement animation="slideUp" delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <StatsCounter 
              count={products.length} 
              label="Total Products" 
              icon={<Package className="w-full h-full" />}
            />
            <StatsCounter 
              count={sortedProducts.length} 
              label="Showing" 
              icon={<SearchIcon className="w-full h-full" />}
            />
            <StatsCounter 
              count={products.reduce((acc, product) => acc + (product.features?.length || 0), 0)} 
              label="Features" 
              icon={<Filter className="w-full h-full" />}
            />
          </div>
        </AnimatedElement>
      )}

      {/* Product Insights */}
      {products.length > 0 && (
        <AnimatedElement animation="slideUp" delay={0.2}>
          <ProductInsights products={products} />
        </AnimatedElement>
      )}

      {/* Search and Controls */}
      <AnimatedElement animation="slideUp" delay={0.15}>
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="max-w-md mx-auto" data-search>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
            />
          </div>

          {/* Filters */}
          {allFeatures.length > 0 && (
            <ProductFilters 
              features={allFeatures}
              onFilterChange={setSelectedFeatureFilters}
            />
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-sm font-medium">Grid</span>
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'order')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-colors bg-white"
              >
                <option value="order">Display Order</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedElement>

      {/* Products Display */}
      <AnimatedElement animation="fadeIn" delay={0.2}>
        {paginatedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 gap-8 grid-stagger" 
            : "space-y-8"
          }>
            {paginatedProducts.map((product, index) => {
              const productImages = product.images && product.images.length > 0 
                ? product.images 
                : product.image_url 
                ? [product.image_url]
                : [];
              
              return (
                <ProductDetail 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    short_description: product.short_description || product.description,
                    category_id: product.category_id || '',
                    image_url: product.image_url || '',
                    features: product.features || [],
                    images: productImages,
                    is_active: product.is_active,
                    display_order: product.display_order
                  }}
                  viewMode={viewMode}
                  index={index}
                  onViewDetails={handleViewProduct}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              {products.length === 0 ? (
                <>
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Products Available</h3>
                  <p className="text-gray-500">
                    No products are currently available in this category.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <SearchIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Results Found</h3>
                  <p className="text-gray-500">
                    No products found matching your search criteria. Try adjusting your search terms.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatedElement>

      {/* Pagination */}
      {totalPages > 1 && (
        <AnimatedElement animation="slideUp" delay={0.3}>
          <ProductNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedProducts.length}
          />
        </AnimatedElement>
      )}

      {/* Quick Navigation */}
      <QuickNavigation />

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProductListDB;