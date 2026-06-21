'use client';

import React from 'react';
import { useCompare } from '@/context/CompareContext';
import { ArrowRightLeft } from 'lucide-react';
import type { Product, StrapiDataItem } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';

interface CompareButtonProps {
  product: StrapiDataItem<Product>;
  className?: string;
  showText?: boolean;
}

export default function CompareButton({ product, className, showText = true }: CompareButtonProps) {
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';

  const isCompared = compareItems.some((p) => p.id === product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
      
      // If after adding we now have 2 items, we can optionally prompt or just redirect
      // For now, let's just let the user see the change and maybe click the nav link.
    }
  };

  const text = locale === 'ar' ? 'مقارنة' : 'Compare';
  const removeText = locale === 'ar' ? 'إزالة من المقارنة' : 'Remove';

  return (
    <button
      onClick={handleClick}
      title={isCompared ? removeText : text}
      className={`flex items-center justify-center gap-2 transition-all ${
        isCompared
          ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
          : 'border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-900/10 text-gray-300'
      } ${className}`}
    >
      {showText && (isCompared ? removeText : text)}
      <ArrowRightLeft className="w-5 h-5" />
    </button>
  );
}
