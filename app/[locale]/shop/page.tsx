import { getProducts } from '@/lib/products';
import PCBuilder from '@/components/PCBuilder';

interface ShopPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Map build step slugs to Strapi category slugs
const BUILD_CATEGORIES = [
  'processeurs',
  'cartes-graphiques',
  'ram',
  'stockage',
  'boitiers',
  'alimentations',
  'refroidissement',
];

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

function resolveImage(product: any): string {
  const attrs = product?.attributes ?? product;
  const images = attrs?.images;
  const image = attrs?.image;

  // Try images array first (Strapi v4 format)
  const firstFromArray =
    images?.data?.[0]?.attributes?.url ??
    (Array.isArray(images) ? images[0]?.url ?? images[0]?.attributes?.url : undefined);

  // Then single image
  const fromSingle = image?.data?.attributes?.url ?? image?.url ?? image?.attributes?.url;

  const raw = firstFromArray ?? fromSingle;
  if (!raw) return '/placeholder.jpg';
  if (raw.startsWith('http')) return raw;
  return `${STRAPI_URL}${raw}`;
}

export default async function ShopPage(props: ShopPageProps) {
  const { locale } = await props.params;

  // Fetch products for every build category in parallel
  const results = await Promise.allSettled(
    BUILD_CATEGORIES.map(cat => getProducts(locale, cat))
  );

  const productsByCategory: Record<string, any[]> = {};

  BUILD_CATEGORIES.forEach((cat, idx) => {
    const result = results[idx];
    if (result.status === 'fulfilled') {
      productsByCategory[cat] = (result.value?.data || []).map((item: any) => {
        const attrs = item?.attributes ?? item;
        return {
          id: item.id,
          name: attrs.name ?? '',
          price: attrs.price ?? 0,
          slug: attrs.slug ?? '',
          imageUrl: resolveImage(item),
          categorySlug: cat,
        };
      });
    } else {
      productsByCategory[cat] = [];
    }
  });

  return <PCBuilder productsByCategory={productsByCategory} />;
}
