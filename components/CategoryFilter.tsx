'use client';

import Link from 'next/link';

interface Category {
  id: number;
  attributes: { name: string; slug: string };
}

export default function CategoryFilter({ 
  categories, 
  activeCategory 
}: { 
  categories: Category[]; 
  activeCategory?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      <Link
        href="/shop"
        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
          !activeCategory 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        الكل
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.attributes.slug}`}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            activeCategory === category.attributes.slug
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.attributes.name}
        </Link>
      ))}
    </div>
  );
}
