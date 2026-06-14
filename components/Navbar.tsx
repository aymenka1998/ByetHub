'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { getProducts } from '@/lib/products';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';
  
  // 1. إضافة الحالة للتحكم في النافذة الجانبية للسلة
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // البحث المباشر مع Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await getProducts(locale, undefined, searchQuery.trim());
          setSearchResults(response.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Live search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // انتظر 300 ملي ثانية بعد توقف الكتابة

    return () => clearTimeout(timer);
  }, [searchQuery, locale]);

  // إغلاق النتائج عند النقر خارج حقل البحث
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // دالة التعامل مع البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  // 2. جلب العناصر الحية من الـ Context
  const { items } = useCart();

  // 3. حساب عدد القطع الإجمالي بأمان
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('store'), href: '/shop' },
    { label: t('gamingPcs'), href: '/shop?category=gaming-pcs' },
    { label: t('laptops'), href: '/shop?category=laptops' },
    { label: t('screens'), href: '/shop?category=monitors' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-bold text-blue-600">انتيجرافيتي</span>
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                {t('tech')}
              </span>
            </Link>

            {/* حقل البحث المتوافق مع اللغتين RTL / LTR */}
            <div className="hidden md:block flex-1 max-w-md relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button type="submit" className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              </form>

              {/* قائمة نتائج البحث الفورية */}
              {showResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-60 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-100 overflow-y-auto p-2">
                    {searchResults.map((product) => {
                      const castedProduct = product as { id: string | number; attributes?: Record<string, unknown> } & Record<string, unknown>;
                      const data = (castedProduct.attributes || castedProduct) as {
                        name: string;
                        slug: string;
                        price: number;
                        image?: { url: string };
                        images?: { url: string }[];
                      } & Record<string, unknown>;
                      const rawImg = data.image?.url || data.images?.[0]?.url;
                      const imageUrl = rawImg ? (rawImg.startsWith('http') ? rawImg : `${STRAPI_URL}${rawImg}`) : '/placeholder.jpg';
                      
                      return (
                        <Link
                          key={castedProduct.id}
                          href={`/product/${data.slug}`}
                          onClick={() => { setShowResults(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image src={imageUrl} alt={data.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 text-right" dir="rtl">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{data.name}</h4>
                            <p className="text-xs font-bold text-blue-600 mt-0.5">{data.price.toLocaleString()} {locale === 'fr' ? 'DZD' : (locale === 'ar' ? 'ر.س' : 'SAR')}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {searchResults.length > 0 && (
                    <button 
                      onClick={handleSearch}
                      className="w-full py-3 bg-gray-50 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
                    >
                      عرض كافة النتائج لـ &quot;{searchQuery}&quot;
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* 4. ربط زر السلة بحدث الفتح وعرض العداد الحي */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
              aria-label="فتح سلة التسوق"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 5. استدعاء مكون السلة الجانبي وتمرير التحكم بالـ state له */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
