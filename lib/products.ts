import { fetchAPI } from './api';
import type { StrapiCollectionResponse, Product, Category, StrapiDataItem } from './types';
import { mockProducts, mockCategories } from './mockData';

// Re-export types so other files can import from here
export type { Product, Category, StrapiCollectionResponse } from './types';

const mockResponse = <T>(data: StrapiDataItem<T>[]): StrapiCollectionResponse<T> => ({
  data,
  meta: { pagination: { page: 1, pageSize: data.length, pageCount: 1, total: data.length } },
});

const ALLOWED_LOCALES = ['ar', 'en', 'fr'];
const getSafeLocale = (locale?: string) => {
  if (!locale || !ALLOWED_LOCALES.includes(locale)) {
    return 'ar';
  }
  return locale;
};

function normalizeStrapiCollection<T>(res: StrapiCollectionResponse<T> | any): StrapiCollectionResponse<T> {
  if (!res || !Array.isArray(res.data)) {
    return res;
  }

  return {
    ...res,
    data: res.data.map((item: any) => {
      if (item && typeof item === 'object' && 'attributes' in item) {
        return item;
      }
      return {
        id: item.id,
        attributes: item,
      };
    }),
  };
}

async function fetchProductsForLocale(
  locale: string,
  query: URLSearchParams
): Promise<StrapiCollectionResponse<Product>> {
  query.set('locale', locale);
  const res = await fetchAPI<StrapiCollectionResponse<Product>>(`/products?${query.toString()}`);
  return normalizeStrapiCollection(res);
}

export async function getProducts(
  locale: string,
  category?: string,
  search?: string
): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = getSafeLocale(locale);
    const query = new URLSearchParams({
      'populate': '*',
      'locale': activeLocale,
    });

    if (category) {
      query.append('filters[category][slug][$eq]', category);
    }

    if (search) {
      query.append('filters[name][$containsi]', search);
    }

    let res = await fetchProductsForLocale(activeLocale, query);
    if (res && res.data && res.data.length > 0) {
      return res;
    }

    if (activeLocale !== 'all') {
      console.warn(`[getProducts] No products found for locale "${activeLocale}". Retrying with locale=all.`);
      res = await fetchProductsForLocale('all', query);
      if (res && res.data && res.data.length > 0) {
        return res;
      }
    }

    throw new Error('No products returned from Strapi API');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('[getProducts] ⚠️ Strapi API failed or returned empty. Falling back to local mock data. Error:', errorMsg);
    
    let filtered = [...mockProducts];
    if (category) {
      filtered = filtered.filter(
        p => p.attributes.category?.data?.attributes?.slug === category
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        p => p.attributes.name.toLowerCase().includes(searchLower)
      );
    }
    return mockResponse(filtered);
  }
}

export async function getProductBySlug(
  locale: string,
  slug: string
): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = getSafeLocale(locale);
    const query = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': '*',
      'locale': activeLocale
    });
    
    let res = await fetchProductsForLocale(activeLocale, query);
    if (res && res.data && res.data.length > 0) {
      return res;
    }

    if (activeLocale !== 'all') {
      console.warn(`[getProductBySlug] Product slug "${slug}" not found for locale "${activeLocale}". Retrying with locale=all.`);
      res = await fetchProductsForLocale('all', query);
      if (res && res.data && res.data.length > 0) {
        return res;
      }
    }

    throw new Error(`Product slug "${slug}" not found in Strapi`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[getProductBySlug] ⚠️ Strapi API failed or returned empty. Falling back to local mock data for slug "${slug}". Error:`, errorMsg);
    
    const product = mockProducts.find(p => p.attributes.slug === slug);
    return mockResponse(product ? [product] : []);
  }
}

export async function getFeaturedProducts(locale: string): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = getSafeLocale(locale);
    const query = new URLSearchParams({
      'filters[isFeatured][$eq]': 'true',
      'populate': '*',
      'locale': activeLocale
    });
    
    const res = await fetchAPI<StrapiCollectionResponse<Product>>(`/products?${query.toString()}`);
    if (res && res.data && res.data.length > 0) {
      return res;
    }
    throw new Error('No featured products found in Strapi');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('[getFeaturedProducts] ⚠️ Strapi API failed or returned empty. Falling back to local mock featured products. Error:', errorMsg);
    
    const featured = mockProducts.filter(p => p.attributes.isFeatured === true);
    return mockResponse(featured);
  }
}

// Alias used by category pages
export const getProductsByCategory = (locale: string, slug: string) => getProducts(locale, slug);

export async function getCategories(locale: string): Promise<StrapiCollectionResponse<Category>> {
  try {
    const activeLocale = getSafeLocale(locale);
    const query = new URLSearchParams({
      'populate': '*',
      'locale': activeLocale
    });

    const res = await fetchAPI<StrapiCollectionResponse<Category>>(`/categories?${query.toString()}`);
    if (res && res.data && res.data.length > 0) {
      return res;
    }
    throw new Error('No categories found in Strapi');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('[getCategories] ⚠️ Strapi API failed or returned empty. Falling back to local mock categories. Error:', errorMsg);
    
    return mockResponse(mockCategories);
  }
}