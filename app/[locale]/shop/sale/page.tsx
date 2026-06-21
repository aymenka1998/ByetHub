import { getSaleProducts, getCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

interface SalePageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SalePage(props: SalePageProps) {
  const { locale } = await props.params;

  const categoriesResponse = await getCategories(locale);
  const productsResponse = await getSaleProducts(locale);

  const categories = (categoriesResponse?.data || []).filter(
    (cat): cat is typeof cat & { attributes: NonNullable<typeof cat.attributes> } =>
      cat?.attributes != null
  );
  
  const products = productsResponse?.data || [];

  const pageTitle = locale === 'ar' ? 'التخفيضات والعروض' : 'Sales and Offers';

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 text-right" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-center justify-center mb-8 bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent p-8 rounded-2xl border border-red-500/20">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
          {pageTitle}
        </h1>
        <p className="text-gray-400 max-w-lg text-center">
          {locale === 'ar' 
            ? 'اكتشف أحدث العروض والخصومات على مختلف المنتجات. الكمية قد تكون محدودة!' 
            : 'Discover the latest offers and discounts on various products. Quantities may be limited!'}
        </p>
      </div>

      <CategoryFilter categories={categories} activeCategory={undefined} />

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-[#0a1120] rounded-xl border border-gray-800">
          {locale === 'ar' ? 'لا توجد عروض متوفرة حالياً.' : 'No sales available at the moment.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
