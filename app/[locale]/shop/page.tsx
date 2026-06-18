import { getProducts, getCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

interface ShopPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage(props: ShopPageProps) {
  const { category, q } = await props.searchParams;
  const { locale } = await props.params;

  const categoriesResponse = await getCategories(locale);
  const productsResponse = await getProducts(locale, category, q);

  const categories = (categoriesResponse?.data || []).filter(
    (cat): cat is typeof cat & { attributes: NonNullable<typeof cat.attributes> } =>
      cat?.attributes != null
  );
  const products = productsResponse?.data || [];

  const activeCategory = categories.find(cat => cat.attributes.slug === category);

  let pageTitle = activeCategory
    ? activeCategory.attributes.name
    : "تصفح كافة المنتجات";

  if (q) {
    pageTitle = locale === 'ar' ? `نتائج البحث عن: "${q}"` : `Search results for: "${q}"`;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>

      <CategoryFilter categories={categories} activeCategory={category} />

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا توجد منتجات متوفرة في هذا القسم حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
