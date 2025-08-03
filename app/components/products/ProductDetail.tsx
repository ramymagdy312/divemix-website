import React from "react";

import ImageGallery from "../common/ImageGallery";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category_id: string;
  image_url: string;
  images: string[];
  features: string[];
  is_active: boolean;
  display_order: number;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
            <ImageGallery images={product.images} alt={product.name} />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">{product.name}</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {product.description}
          </p>
          {product.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3">Key Features:</h4>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;