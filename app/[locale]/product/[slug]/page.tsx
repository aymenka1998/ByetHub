import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { getProductBySlug } from '@/lib/products';
import type { Product, StrapiDataItem } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import CurrencyPrice from '@/components/CurrencyPrice';
import CompareButton from '@/components/CompareButton';
import { Star, Heart, ArrowRightLeft } from 'lucide-react';

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
    <main className="min-h-screen relative text-white overflow-hidden py-16" dir="rtl">
      {/* Grid background */}
      <div className="absolute inset-0 z-[-1] bg-[#060B18] bg-[linear-gradient(to_right,#112130_1px,transparent_1px),linear-gradient(to_bottom,#112130_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      
      <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Child 1: Product Image (Right side in RTL) */}
        <div className="flex flex-col gap-6 w-full">
          <div className="border border-cyan-900/50 bg-[#0a1120]/80 rounded-xl overflow-hidden backdrop-blur-sm relative shadow-2xl shadow-cyan-900/10">
            {/* Top Bar matching image */}
            <div className="bg-[#0f192c] border-b border-cyan-900/50 p-3 flex flex-wrap justify-between items-center text-xs font-mono text-cyan-400">
              <div className="flex items-center gap-2">
                <span className="font-bold">ByteHub_STATUS::OPTIMAL</span>
                <span className="text-gray-500">{'->'} graphique...</span>
              </div>
              <div className="flex gap-4 hidden sm:flex text-gray-400">
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Accueil</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Boutique</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">PC Gaming</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Portables</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Ecran</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center text-xs font-mono text-cyan-500 border-b border-cyan-900/30 bg-[#0d1424]">
               <span>[ THERMAL_LOAD: 34% ]</span>
            </div>

            {/* Image Container */}
            <div className="p-8 relative flex items-center justify-center min-h-[450px]">
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-500/90 text-white px-6 py-2 rounded text-xl font-bold z-10 shadow-lg" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
                  خصم {discountPercent}%
                </div>
              )}
              <Image
                src={mainImageUrl}
                alt={name}
                width={800}
                height={600}
                className="object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
                unoptimized
                priority
              />
              <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-500 text-left">
                <div>[ SYNC_ACTIVE: RGB_CONTROLLER ]</div>
                <div>[ FPS_BOOST: ENABLED ]</div>
              </div>
            </div>
          </div>

          {/* Tech Specs tags */}
          <div className="flex flex-wrap gap-4 justify-center mt-2">
             <div className="border border-gray-600 px-6 py-2 bg-transparent text-gray-300 font-mono text-sm tracking-wider uppercase">64GB DDR5</div>
             <div className="border border-gray-600 px-6 py-2 bg-transparent text-gray-300 font-mono text-sm tracking-wider uppercase">CORE I9 14900K</div>
             <div className="border border-gray-600 px-6 py-2 bg-transparent text-gray-300 font-mono text-sm tracking-wider uppercase">RTX 4090 READY</div>
          </div>
        </div>

        {/* Child 2: Details (Left side in RTL) */}
        <div className="flex flex-col items-start text-right w-full gap-8">
          
          {/* Top row: Tag and Stars */}
          <div className="flex justify-between w-full items-center">
             <div className="text-cyan-400 border border-cyan-400/30 bg-cyan-900/20 px-4 py-1.5 rounded text-sm font-mono tracking-widest flex-shrink-0">
               {sku ? sku : 'منتج تقني'}
             </div>
             <div className="flex gap-1.5 text-cyan-400">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className="w-6 h-6 fill-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
               ))}
             </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold uppercase tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-6 w-full justify-start">
             <span className="text-5xl lg:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
               <CurrencyPrice amount={price} />
             </span>
             {hasDiscount && (
               <span className="text-2xl text-gray-500 line-through decoration-gray-600">
                 <CurrencyPrice amount={originalPrice} />
               </span>
             )}
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-right font-sans text-lg">
            <BlocksRenderer content={description as BlocksContent} />
          </div>

          {/* Feature Tags list */}
          <div className="flex flex-col gap-3 font-mono text-cyan-200/70 text-sm tracking-widest uppercase text-center w-full my-2">
            <div>| TEMPERED GLASS |  | ARGB LIGHTING |</div>
            <div>| TOOL-LESS DESIGN |  | LIQUID COOLING SUPPORT |</div>
          </div>

          {/* Actions Box */}
          <div className="w-full bg-[#0a1120]/80 border border-cyan-900/50 p-6 rounded-xl flex flex-col gap-6 backdrop-blur-sm shadow-xl shadow-cyan-900/5">
            <AddToCartButton product={productItem} />

            {/* Wishlist & Compare */}
            <div className="flex gap-4 w-full mt-2">
              <button className="flex-1 border border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-900/10 text-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                أضف للمفضلة <Heart className="w-5 h-5" />
              </button>
              <CompareButton product={productItem} className="flex-1 py-3 rounded-lg" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}