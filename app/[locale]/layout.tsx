
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import { CountryProvider } from '@/context/CountryContext';
import { CompareProvider } from '@/context/CompareContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/app/globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CountryProvider>
            <CartProvider>
              <CompareProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </CompareProvider>
            </CartProvider>
          </CountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}