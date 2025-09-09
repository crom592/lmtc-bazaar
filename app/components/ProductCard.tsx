
import React from 'react';
import Link from 'next/link';
import type { Product } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images?.[0]?.thumbnailUrl || product.images?.[0]?.imageUrl;
  const imageCount = product.images?.length || 0;

  return (
    <Link href={`/?page=product&id=${product.id}`} className="group block">
      <Card className="group-hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative">
          <img 
            src={mainImage || '/placeholder-image.png'} 
            alt={product.name} 
            className="w-full h-56 object-cover" 
          />
          {/* 이미지 개수 표시 */}
          {imageCount > 1 && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-black/70 text-white">
              📷 {imageCount}
            </Badge>
          )}
          {/* Description Tooltip Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-center text-sm">
              {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
          <p className="text-xl font-bold text-primary mt-2">{product.price.toLocaleString()}원</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
