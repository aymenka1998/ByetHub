import { Suspense } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getFeaturedProducts } from '@/lib/products';

async function FeaturedProductsSection({ params }: { params: { locale: string } }) {
  const productsRes = await getFeaturedProducts(params?.locale);
  const products = productsRes.data || [];
  return <FeaturedProducts products={products} />;
}

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">جاري التحميل…</div>}>
        <FeaturedProductsSection params={params} />
      </Suspense>
    </>
  );
}
