import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { getProductBySlug } from '@/lib/products';
import type { Product, StrapiDataItem } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import CurrencyPrice from '@/components/CurrencyPrice';

interface PageProps { params: Promise<{ locale: string; slug: string }>; }

export const dynamic = 'force-dynamic';

function resolveImageUrl(imagePath?: string): string {
  if (!imagePath) return '/placeholder.jpg';

  const trimmed = imagePath.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? '').replace(/\/+$/, '').replace(/\/admin$/, '');
  if (!baseUrl) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return `${baseUrl}${trimmed}`;
  }

  return `${baseUrl}/${trimmed}`;
}

export default async function ProductPage(props: PageProps) {
  const { slug, locale } = await props.params;
  const response = await getProductBySlug(locale, slug);
  const productItem = response?.data?.[0] as StrapiDataItem<Product> | undefined;
  const data = productItem?.attributes ?? (productItem as unknown as Product);

  if (!productItem || !data || !data.name) return notFound();

  const { name, price, originalPrice, description, sku, features, images, image } = data as Product;
  const hasDiscount = !!originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const safeImages = Array.isArray(images) ? images : undefined;
  const firstImageUrl = safeImages?.[0]?.attributes?.url;
  const firstImageDirectUrl = safeImages?.[0] && typeof safeImages[0] === 'object'
    ? (safeImages[0] as { url?: string }).url
    : undefined;
  const imageDirectUrl = image && typeof image === 'object'
    ? (image as { data?: { attributes?: { url?: string } }; url?: string }).url ?? image.data?.attributes?.url
    : undefined;

  const mainImageUrl = resolveImageUrl(
    firstImageUrl ?? firstImageDirectUrl ?? imageDirectUrl
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* الجانب الأيسر: معلومات المنتج */}
        <div className="space-y-6">
          <div className="text-sm text-cyan-400 font-mono tracking-widest uppercase">
            {sku ? `SKU: ${sku}` : 'منتج تقني'}
          </div>
          <h1 className="text-5xl font-extrabold leading-tight">{name}</h1>
          
          <div className="flex items-center gap-6">
            <span className="text-4xl font-bold text-white"><CurrencyPrice amount={price} /></span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through decoration-red-500"><CurrencyPrice amount={originalPrice} /></span>
            )}
          </div>

          <div className="prose prose-invert max-w-none text-gray-300">
            <BlocksRenderer content={description as BlocksContent} />
          </div>

          {/* زر الإضافة */}
          <div className="pt-6">
            <AddToCartButton
              product={productItem}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* الجانب الأيمن: الصورة */}
        <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-800 relative flex items-center justify-center">
          <Image
            src={mainImageUrl}
            alt={name}
            width={600}
            height={600}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
            unoptimized
            priority
          />
          {hasDiscount && (
            <span className="absolute top-6 left-6 bg-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">خصم {discountPercent}%</span>
          )}
        </div>
      </div>

      {/* قسم المواصفات التقنية */}
      {features && (
        <section className="max-w-7xl mx-auto mt-24 border-t border-gray-800 pt-16">
          <h2 className="text-2xl font-bold mb-10 text-cyan-400">المواصفات التقنية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500 transition-all">
                <h4 className="text-gray-400 text-sm mb-2 uppercase">{key}</h4>
                <p className="text-lg font-semibold">{value as string}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}