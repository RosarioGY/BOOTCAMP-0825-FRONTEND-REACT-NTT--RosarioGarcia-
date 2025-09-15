// HomePage.tsx - Home page component
import { useState } from 'react';
import { useProducts, useFilteredProducts } from '@/modules/home/hooks/useProducts';
import SearchBox from '@/modules/home/components/SearchBox';
import CategoryFilter from '@/modules/home/components/CategoryFilter';
import ProductCard from '@/modules/home/components/ProductCard';
import Pagination from '@/modules/home/components/Pagination';
import { usePagination } from '@/modules/home/hooks/usePagination';
import { useCart } from '@/modules/cart/hooks/useCart';
import { Modal } from '@/shared/components/ui/Modal';
import { Alert } from '@/shared/components/ui/Alert';
import { Layout } from '@/shared/components/layout/Layout';

export function HomePage() {
  const { loading, products, categories, error } = useProducts();
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState<'Todos' | string>('Todos');
  const [stockModal, setStockModal] = useState<string | null>(null);
  const { addOne } = useCart();

  const list = useFilteredProducts(products, term, category);
  const { page, totalPages, pageItems, go, setPage } = usePagination(list, 12);

  const onClear = () => { setTerm(''); setPage(1); };
  const onSelectCategory = (c: 'Todos' | string) => { setCategory(c); setPage(1); };

  const onAddToCart = (p: (typeof products)[number]) => {
    const res = addOne({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock });
    if (res === 'out_of_stock') setStockModal(`Ya no hay más stock disponible para "${p.title}".`);
  };

  if (loading) return <Layout><p style={{ padding: 16 }}>Cargando productos…</p></Layout>;
  if (error)   return <Layout><Alert type="error" message={error} /></Layout>;

  return (
    <Layout>
      <section style={{ display: 'grid', gap: 16, padding: 16 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        <SearchBox value={term} onChange={setTerm} onClear={onClear} />
        <CategoryFilter categories={categories} selected={category} onSelect={onSelectCategory} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12
        }}
      >
        {pageItems.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={go} />

      <Modal isOpen={!!stockModal} onClose={() => setStockModal(null)} title="Stock insuficiente">
        <Alert type="warning" message={stockModal || ''} />
      </Modal>
    </section>
    </Layout>
  );
}
