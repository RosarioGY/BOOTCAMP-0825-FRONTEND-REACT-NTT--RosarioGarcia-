// products.mappers.ts - Products mappers
import type { RawProduct, Product } from '@/modules/home/types/products.types';

export const mapProduct = (raw: RawProduct): Product => ({
  id: raw.id,
  title: raw.title,
  description: raw.description,
  price: raw.price,
  rating: raw.rating,
  stock: raw.stock,
  brand: raw.brand,
  category: raw.category,
  thumbnail: raw.thumbnail,
});
export const mapProducts = (raws: RawProduct[]): Product[] => raws.map(mapProduct);