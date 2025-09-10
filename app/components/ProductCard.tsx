
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <Card className="group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-white rounded-2xl">
        <div className="relative h-80 overflow-hidden">
          <Image 
            src={mainImage || '/placeholder-image.png'} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            quality={90}
          />
          {/* 이미지 개수 표시 */}
          {imageCount > 1 && (
            <Badge className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
              📷 {imageCount}
            </Badge>
          )}
          {/* 할인 배지 스타일 */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
              특가
            </Badge>
          </div>
          {/* Description Tooltip Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-white text-center font-medium">
              {product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description}
            </p>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="mb-3">
            <Badge variant="outline" className="text-xs text-slate-500 bg-slate-50 mb-2">
              {product.category}
            </Badge>
            <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">
                {product.price.toLocaleString()}
                <span className="text-lg font-semibold">원</span>
              </span>
              <span className="text-sm text-green-600 font-semibold">무료배송</span>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>⭐⭐⭐⭐⭐</div>
              <div className="mt-1">리뷰 ({Math.floor(Math.random() * 100)})</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
