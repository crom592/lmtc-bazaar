
import React from 'react';
import Link from 'next/link';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images?.[0]?.thumbnailUrl || product.images?.[0]?.imageUrl;
  const imageCount = product.images?.length || 0;

  return (
    <Link href={`/?page=product&id=${product.id}`} className="group block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img 
          src={mainImage || '/placeholder-image.png'} 
          alt={product.name} 
          className="w-full h-56 object-cover" 
        />
        {/* 이미지 개수 표시 */}
        {imageCount > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            📷 {imageCount}
          </div>
        )}
        {/* Description Tooltip Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-center text-sm">
            {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
          </p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-xl font-bold text-orange-600 mt-2">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  );
};

export default ProductCard;
