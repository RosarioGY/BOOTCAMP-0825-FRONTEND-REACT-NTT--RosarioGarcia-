import type { Product } from '../types/products.types';
import { Button } from '../../../shared/components/ui/Button';

type Props = {
  product: Product;
  onAddToCart: (p: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <article
      style={{
        border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <img src={product.thumbnail} alt={product.title} style={{ aspectRatio: '16/10', objectFit: 'cover' }} />
      <div style={{ padding: 12, display: 'grid', gap: 6 }}>
        <strong>{product.title}</strong>
        <small style={{ color: '#64748b' }}>{product.brand} · {product.category}</small>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</span>
          <Button type="button" onClick={() => onAddToCart(product)}>Agregar al carrito</Button>
        </div>
        <small style={{ color: '#475569' }}>Stock: {product.stock}</small>
      </div>
    </article>
  );
}
