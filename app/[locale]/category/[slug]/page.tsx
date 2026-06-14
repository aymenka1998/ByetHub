import { getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.trim() === '' || slug === '.') {
    notFound();
  }

  const { data: products } = await getProductsByCategory(slug);

  if (!products || products.length === 0) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <span>/</span>
        <span className="text-gray-900 capitalize">{slug.replace(/-/g, ' ')}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8 capitalize">{slug.replace(/-/g, ' ')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={products} />
        ))}
      </div>
    </main>
  );
}