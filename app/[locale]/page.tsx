import { Suspense } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getFeaturedProducts } from '@/lib/products';

async function FeaturedProductsSection({ locale }: { locale: string }) {
  const productsRes = await getFeaturedProducts(locale);
  const products = productsRes.data || [];
  return <FeaturedProducts products={products} />;
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">جاري التحميل…</div>}>
        <FeaturedProductsSection locale={locale} />
      </Suspense>
    </>
  );
}
