
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images?.[0]?.thumbnailUrl || product.images?.[0]?.imageUrl;
  const imageCount = product.images?.length || 0;

  return (
    <Link href={`/?page=product&id=${product.id}`} className="group block">
      <Card className="group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-white rounded-2xl">
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={mainImage || '/placeholder-image.png'} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            quality={95}
            priority={false}
          />
          {/* 이미지 개수 표시 */}
          {imageCount > 1 && (
            <Badge className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Camera size={12} />
              {imageCount}
            </Badge>
          )}
          {/* 할인 배지 스타일 */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
              특가
            </Badge>
          </div>
          {/* Description Tooltip Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
            </div>
            <div className="text-right text-xs text-slate-400">
              <div className="flex items-center justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="mt-1">리뷰 ({Math.floor(Math.random() * 100)})</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
