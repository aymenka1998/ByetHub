'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import CountrySwitcher from './CountrySwitcher';
import { useCart } from '@/context/CartContext';
import { useCountry } from '@/context/CountryContext';
import CartDrawer from './CartDrawer';
import { getProducts } from '@/lib/products';
import Image from 'next/image';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { country } = useCountry();
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  
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
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const { items } = useCart();
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
      <header className="sticky top-0 z-50 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-bold text-white tracking-tight">Byte</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">Hub</span>
            </Link>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder-white/30 outline-none transition-all"
                />
                <button type="submit" className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-white/40 hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </form>

              {showResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1526]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden z-60 animate-fadeIn">
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
                      const currencyValue = formatCurrency(convertCurrency(data.price, 'SAR', currency), currency, currencyLocale);
                      
                      return (
                        <Link
                          key={castedProduct.id}
                          href={`/product/${data.slug}`}
                          onClick={() => { setShowResults(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2 hover:bg-white/[0.05] rounded-xl transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                            <Image src={imageUrl} alt={data.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 text-right" dir="rtl">
                            <h4 className="text-sm font-bold text-white/90 line-clamp-1 group-hover:text-cyan-400 transition-colors">{data.name}</h4>
                            <p className="text-xs font-bold text-cyan-400 mt-0.5">{currencyValue}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {searchResults.length > 0 && (
                    <button 
                      onClick={handleSearch}
                      className="w-full py-3 bg-white/[0.03] text-center text-xs font-bold text-cyan-400 hover:bg-white/[0.06] transition-colors border-t border-white/[0.06]"
                    >
                      عرض كافة النتائج لـ &quot;{searchQuery}&quot;
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CountrySwitcher />
            <LanguageSwitcher />

            {/* Account icon */}
            <button className="p-2 hover:bg-white/[0.07] rounded-xl transition-colors" aria-label="حساب المستخدم">
              <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/[0.07] rounded-xl transition-colors"
              aria-label="فتح سلة التسوق"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
