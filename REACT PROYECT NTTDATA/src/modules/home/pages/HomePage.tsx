// HomePage.tsx - Home page component
import { useState } from 'react';
import { useProducts, useFilteredProducts } from '@/modules/home/hooks/useProducts';
import CategoryChips from '@/modules/home/components/CategoryFilter';
import { usePagination } from '@/modules/home/hooks/usePagination';
import { useCart } from '@/modules/cart/hooks/useCart';
import { Modal } from '@/shared/components/ui/Modal';
import { Alert } from '@/shared/components/ui/Alert';
import { Layout } from '@/shared/components/layout/Layout';
import { CATEGORY_ES, formatPricePEN } from '@/shared/utils/locale';

export function HomePage() {
  const { loading, products, categories, error } = useProducts();
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState<'Todos' | string>('Todos');
  const [stockModal, setStockModal] = useState<string | null>(null);
  const { addOne } = useCart();

  const filteredProducts = useFilteredProducts(products, term, category);
  const { page, totalPages, pageItems, next, prev, setPage } = usePagination(filteredProducts, 12);

  const onSelectCategory = (c: 'Todos' | string) => { setCategory(c); setPage(1); };

  const addToCart = (p: (typeof products)[number]) => {
    const res = addOne({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, stock: p.stock });
    if (res === 'out_of_stock') setStockModal(`Ya no hay más stock disponible para "${p.title}".`);
  };

  // Generar array de páginas para el paginador
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) return <Layout><p style={{ padding: 16 }}>Cargando productos…</p></Layout>;
  if (error)   return <Layout><Alert type="error" message={error} /></Layout>;

  return (
    <Layout>
      <main className="app-container home-page">
        <header>
          <h1>Catálogo de Productos</h1>
        </header>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar productos… (mínimo 3 caracteres)"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          <CategoryChips
            categories={categories}
            selected={category}
            onSelect={onSelectCategory}
          />
        </div>

        {pageItems.length === 0 ? (
          <div className="empty-state">No hay productos para esta selección.</div>
        ) : (
          <div className="product-grid">
            {pageItems.map(p => (
              <article className="product-card" key={p.id}>
                <div className="product-media">
                  <img src={p.thumbnail} alt={p.title} />
                </div>

                <h3 className="product-title">{p.title}</h3>
                <div className="product-meta">{p.brand} · {CATEGORY_ES[p.category] ?? p.category}</div>

                <div className="product-bottom">
                  <div className="product-price">{formatPricePEN(p.price)}</div>
                  <button className="add-to-cart" onClick={() => addToCart(p)}>
                    Agregar al carrito
                  </button>
                  <div className="product-stock">Stock: {p.stock}</div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="pager">
            <button className="pager-nav" onClick={prev} disabled={page === 1}>‹</button>
            {pages.map(n => (
              <button
                key={n}
                className={`pager-page ${page === n ? 'is-active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className="pager-nav" onClick={next} disabled={page === totalPages}>›</button>
          </div>
        )}

        <Modal isOpen={!!stockModal} onClose={() => setStockModal(null)} title="Stock insuficiente">
          <Alert type="warning" message={stockModal || ''} />
        </Modal>
      </main>
    </Layout>
  );
}
