export interface MenuVariant {
  label: string;
  labelAr?: string;
  price: number;
}

export interface MenuItem {
  id: number;
  titleEn: string;
  titleAr: string;
  image?: string;
  description?: string;
  isPopular: boolean;
  isAvailable: boolean;
  // Exactly one of price | variants must be present
  price?: number;
  variants?: MenuVariant[];
}

export interface MenuCategory {
  id: number;
  nameEn: string;
  nameAr: string;
  icon: string;
  coverImage?: string;
  items: MenuItem[];
}

export interface MenuData {
  restaurantName: string;
  currency: string;
  categories: MenuCategory[];
}

/** Returns the lowest price for an item (handles both single and multi-price) */
export function getStartingPrice(item: MenuItem): number {
  if (item.price !== undefined) return item.price;
  if (item.variants && item.variants.length > 0) {
    return Math.min(...item.variants.map(v => v.price));
  }
  return 0;
}

/** Returns true if item uses variants pricing */
export function hasVariants(item: MenuItem): item is MenuItem & { variants: MenuVariant[] } {
  return Array.isArray(item.variants) && item.variants.length > 0;
}
