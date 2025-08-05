"use client";

import React from 'react';
import { TrendingUp, Award, Zap, Target } from 'lucide-react';
import AnimatedElement from '../common/AnimatedElement';
import StatsCounter from '../common/StatsCounter';

interface Product {
  id: string;
  name: string;
  features?: string[];
}

interface ProductInsightsProps {
  products: Product[];
  className?: string;
}

const ProductInsights: React.FC<ProductInsightsProps> = ({ products, className = "" }) => {
  if (products.length === 0) return null;

  // Calculate insights
  const totalFeatures = products.reduce((acc, product) => acc + (product.features?.length || 0), 0);
  const avgFeaturesPerProduct = Math.round(totalFeatures / products.length);
  const mostFeaturedProduct = products.reduce((max, product) => 
    (product.features?.length || 0) > (max.features?.length || 0) ? product : max
  );
  const uniqueFeatures = new Set(
    products.flatMap(product => product.features || [])
  ).size;

  return (
    <div className={`bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 ${className}`}>
      <AnimatedElement animation="fadeIn">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Product Insights</h3>
            <p className="text-gray-600">Discover what makes our products special</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:border-cyan-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalFeatures}</div>
              <div className="text-sm text-gray-600">Total Features</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:border-cyan-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{avgFeaturesPerProduct}</div>
              <div className="text-sm text-gray-600">Avg per Product</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:border-cyan-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{uniqueFeatures}</div>
              <div className="text-sm text-gray-600">Unique Features</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:border-cyan-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{mostFeaturedProduct.features?.length || 0}</div>
              <div className="text-sm text-gray-600">Max Features</div>
            </div>
          </div>

          {/* Featured Product */}
          {mostFeaturedProduct.features && mostFeaturedProduct.features.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Most Featured Product</h4>
                  <p className="text-sm text-gray-600">{mostFeaturedProduct.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mostFeaturedProduct.features.slice(0, 5).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border border-cyan-200"
                  >
                    {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                  </span>
                ))}
                {mostFeaturedProduct.features.length > 5 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{mostFeaturedProduct.features.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </AnimatedElement>
    </div>
  );
};

export default ProductInsights;