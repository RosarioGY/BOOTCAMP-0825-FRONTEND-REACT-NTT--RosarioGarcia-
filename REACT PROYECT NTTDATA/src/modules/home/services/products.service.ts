// products.service.ts - Products service
import { apiFetch } from '@/shared/utils/fetchClient';
import { API } from '@/shared/constants/api';
import type { RawProduct, Product } from '@/modules/home/types/products.types';
import { mapProduct } from '@/modules/home/mappers/products.mappers';

type RawList = { products: RawProduct[] };

// Limpiamos el cache para forzar la recarga con los nuevos cambios
let productsCache: Product[] | null = null;
let productsPromise: Promise<Product[]> | null = null;

let categoriesCache: string[] | null = null;
let categoriesPromise: Promise<string[]> | null = null;

export async function getAllProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;
  if (productsPromise) return productsPromise;

  productsPromise = (async () => {
    const data = await apiFetch<RawList>(API.products);
    const mapped = data.products.map(mapProduct);
    productsCache = mapped;
    return mapped;
  })();

  return productsPromise;
}

export async function getAllCategories(): Promise<string[]> {
  if (categoriesCache) return categoriesCache;
  if (categoriesPromise) return categoriesPromise;

  categoriesPromise = (async () => {
    // La API de DummyJSON devuelve un array de strings directamente
    const list = await apiFetch<string[]>(API.categories);
    categoriesCache = list;
    return list;
  })();

  return categoriesPromise;
}
