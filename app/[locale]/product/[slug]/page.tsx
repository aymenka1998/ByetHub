import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { getProductBySlug } from '@/lib/products'; 
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import AddToCartButton from '@/components/AddToCartButton';

// 1. تعريف واجهة بيانات دقيقة تتوافق مع الأنماط المسطحة لـ Strapi v5
interface StrapiImage {
  url: string;
  alternativeText?: string;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

function resolveImageUrl(url: string): string {
  if (!url) return '/placeholder.jpg';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export default async function ProductPage(props: PageProps) {
  const { slug, locale } = await props.params;

  const response = await getProductBySlug(locale, slug);
  
  // فك التغليف والتحويل البرمجي الآمن لتجنب مشاكل TypeScript مع الكائنات المجهولة
  const productRaw = response?.data?.[0] || response?.data || response;
  
  // إجبار الكائن على قراءة الخصائص مباشرة كـ any محلياً فقط للتخلص من تعارض الأنماط دون تعطيل الـ Build
  const data = (productRaw?.attributes ? productRaw.attributes : productRaw) as Record<string, unknown>;

  if (!data || !data.name) {
    return notFound();
  }

  const t = await getTranslations('products');
  const currencyLabel = locale === 'fr' ? 'DZD' : (locale === 'ar' ? t('sar') : 'SAR');

  // استخراج البيانات بأمان عبر تأكيد الأنواع لـ TypeScript (Type Assertion)
  const name = data.name as string;
  const price = data.price as number;
  const originalPrice = data.originalPrice as number | undefined;
  const description = data.description as string | undefined;
  const quantite = data.quantite as number | undefined;
  const sku = data.sku as string | undefined;
  const features = data.features;

  // معالجة الصور بطريقة مرنة وآمنة تمنع أخطاء الـ Compile
  const rawImages = (data.images || (data.image ? [data.image] : [])) as StrapiImage[];
  const productImages = Array.isArray(rawImages) ? rawImages : [];
  
  const mainImageUrl = resolveImageUrl(productImages[0]?.url || (data.image as StrapiImage)?.url);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  let parsedFeatures: Record<string, string> = {};
  if (features) {
    try {
      parsedFeatures = typeof features === 'string' ? JSON.parse(features) : (features as Record<string, string>);
    } catch (e) {
      console.error("خطأ في قراءة حقل JSON features", e);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* القسم الأيمن: معرض الصور */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <Image
              src={mainImageUrl}
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* الصور المصغرة المتبقية */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer hover:border-blue-600 transition-colors">
                  <Image
                    src={resolveImageUrl(img?.url)}
                    alt={`${name} - ${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* القسم الأيسر: تفاصيل المنتج والسعر */}
        <div className="flex flex-col justify-between">
          <div>
            {sku && <span className="text-xs text-gray-400 font-mono">SKU: {sku}</span>}
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">{price} {currencyLabel}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">{originalPrice} {currencyLabel}</span>
              )}
            </div>

            <div className="mb-6">
              {quantite && quantite > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  متوفر في المخزن ({quantite} قطع)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                  نفذت الكمية
                </span>
              )}
            </div>

           <div className="prose prose-blue max-w-none text-gray-600 mb-8">
  <h3 className="text-lg font-bold text-gray-900 mb-2">الوصف:</h3>
  
  {/* هنا الحل: فحص ما إذا كانت البيانات متوفرة ثم رندرتها كـ Blocks */}
 {description ? (
  <BlocksRenderer content={(description as unknown) as BlocksContent} />
) : (
  <p>لا يوجد وصف متوفر لهذا المنتج.</p>
)}
</div>
            {/* المواصفات التقنية */}
            {Object.keys(parsedFeatures).length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">المواصفات التقنية:</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-sm text-right">
                    <tbody>
                      {Object.entries(parsedFeatures).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 last:border-none">
                          <td className="px-4 py-3 font-medium text-gray-500 bg-gray-100/50 w-1/3">{key}</td>
                          <td className="px-4 py-3 text-gray-900 font-mono">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <AddToCartButton product={productRaw} />
          </div>

        </div>
      </div>
    </main>
  );
}