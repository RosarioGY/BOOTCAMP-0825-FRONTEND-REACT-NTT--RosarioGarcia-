// useProducts.ts - Products custom hook
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../types/products.types';
import { getAllProducts, getAllCategories } from '../services/products.service';

export function useProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, c] = await Promise.all([getAllProducts(), getAllCategories()]);
        if (mounted) {
          setProducts(p);
          setCategories(c);
          setError(null);
        }
      } catch {
        if (mounted) setError('Algo salió mal, inténtelo más tarde');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { loading, products, categories, error };
}

export function useFilteredProducts(
  products: Product[],
  term: string,
  category: string | 'Todos'
) {
  const normalized = term.trim().toLowerCase();

  return useMemo(() => {
    const byCategory = category === 'Todos'
      ? products
      : products.filter(p => p.category === category);

    if (normalized.length === 0) return byCategory;
    if (normalized.length < 3) return byCategory; // Home: búsqueda empieza con 3+ chars

    return byCategory.filter(p =>
      (p.title?.toLowerCase?.().includes(normalized) ?? false) ||
      (p.description?.toLowerCase?.().includes(normalized) ?? false) ||
      (p.brand?.toLowerCase?.().includes(normalized) ?? false)
    );
  }, [products, category, normalized]);
}
