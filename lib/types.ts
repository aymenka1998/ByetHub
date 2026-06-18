// ===== Strapi Response Types =====
export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  } | null;
}

export interface StrapiImages {
  data: Array<{
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  }> | null;
}

export interface StrapiDataItem<T> {
  id: number;
  attributes: T;
}

export interface StrapiCollectionResponse<T> {
  data: StrapiDataItem<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: StrapiDataItem<T> | null;
}

// ===== Strapi Blocks (Rich Text) =====
export interface StrapiTextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiBlockNode {
  type: 'paragraph' | 'heading' | 'list' | 'list-item' | 'quote' | 'code' | 'image';
  level?: number; // for headings
  format?: 'ordered' | 'unordered'; // for lists
  children: (StrapiTextNode | StrapiBlockNode)[];
}

export type StrapiRichText = StrapiBlockNode[];

// ===== Content Types (matching your Strapi schema) =====
export interface Product {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description?: StrapiRichText;
  image?: StrapiImage;
  images?: StrapiImages;
  isFeatured?: boolean;
  isOffer?: boolean;
  quantite?: number;
  sku?: string;
  features?: Record<string, string | number | boolean>;
  rating?: number;
  category?: {
    data: {
      id: number;
      attributes: Category;
    } | null;
  };
  reviews?: StrapiCollectionResponse<Review>;
}

export interface Category {
  name: string;
  slug: string;
  image?: StrapiImage;
  products?: StrapiCollectionResponse<Product>;
}

export interface Review {
  rating: number;
  comment: string;
}

// Helper: get discount percentage
export function getDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
