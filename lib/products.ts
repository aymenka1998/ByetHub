import { fetchAPI } from './api';
import type { StrapiCollectionResponse, Product, Category } from './types';

// Re-export types so other files can import from here
export type { Product, Category, StrapiCollectionResponse } from './types';

const emptyResponse = <T>(): StrapiCollectionResponse<T> => ({
  data: [],
  meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
});

export async function getProducts(
  locale: string,
  category?: string,
  search?: string
): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = locale || 'ar';
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

    return await fetchAPI<StrapiCollectionResponse<Product>>(`/products?${query.toString()}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[getProducts] Failed to fetch products:', errorMsg);
    if (errorMsg.includes('503') || errorMsg.includes('500')) {
      console.warn('[getProducts] ⚠️  Strapi service unavailable. Returning empty list.');
    }
    return emptyResponse<Product>();
  }
}

export async function getProductBySlug(
  locale: string,
  slug: string
): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = locale || 'ar';
    const query = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': '*',
      'locale': activeLocale
    });
    
    return await fetchAPI<StrapiCollectionResponse<Product>>(`/products?${query.toString()}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[getProductBySlug] Failed to fetch slug "${slug}":`, errorMsg);
    if (errorMsg.includes('503') || errorMsg.includes('500')) {
      console.warn(`[getProductBySlug] ⚠️  Strapi service unavailable for slug "${slug}".`);
    }
    return emptyResponse<Product>();
  }
}

export async function getFeaturedProducts(locale: string): Promise<StrapiCollectionResponse<Product>> {
  try {
    const activeLocale = locale || 'ar';
    const query = new URLSearchParams({
      'filters[isFeatured][$eq]': 'true',
      'populate': '*',
      'locale': activeLocale
    });
    
    return await fetchAPI<StrapiCollectionResponse<Product>>(`/products?${query.toString()}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[getFeaturedProducts] Failed to fetch featured products:', errorMsg);
    
    // Log a clear message when Strapi is unavailable
    if (errorMsg.includes('503') || errorMsg.includes('500') || errorMsg.includes('AbortError')) {
      console.warn('[getFeaturedProducts] ⚠️  Strapi service appears to be unavailable. Returning empty product list.');
    }
    
    // If 404 on isFeatured filter, try falling back to recent products
    if (errorMsg.includes('404') || errorMsg.includes('NotFoundError')) {
      console.warn('[getFeaturedProducts] ⚠️  Featured products filter returned 404. This may mean the isFeatured field does not exist on the Strapi products collection. Try:');
      console.warn('  1. Ensure the "isFeatured" field exists in your Strapi products collection');
      console.warn('  2. Publish at least one product with isFeatured=true');
      console.warn('  3. Make sure the products collection has public read permissions in Strapi');
    }
    
    return emptyResponse<Product>();
  }
}

// Alias used by category pages
export const getProductsByCategory = (locale: string, slug: string) => getProducts(locale, slug);

export async function getCategories(locale: string): Promise<StrapiCollectionResponse<Category>> {
  try {
    const activeLocale = locale || 'ar';
    const query = new URLSearchParams({
      'populate': '*',
      'locale': activeLocale
    });

    return await fetchAPI<StrapiCollectionResponse<Category>>(`/categories?${query.toString()}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[getCategories] Failed to fetch categories:', errorMsg);
    if (errorMsg.includes('503') || errorMsg.includes('500')) {
      console.warn('[getCategories] ⚠️  Strapi service unavailable. Returning empty categories.');
    }
    return emptyResponse<Category>();
  }
}