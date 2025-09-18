import type { Product } from '@/modules/home/types/products.types';
import { CATEGORY_ES, uiES, formatPricePEN, usdToPen, capitalize } from '@/shared/utils/locale';

type Props = {
  product: Product;
  onAddToCart: (p: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  // si product.currency === 'USD' -> conviertes; si ya está en PEN, omite usdToPen
  const pricePen = formatPricePEN(usdToPen(product.price)); 

  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.thumbnail} alt={product.title} />
      </div>

      <h3 className="product-title">{product.title}</h3>

      <div className="product-meta">
        {product.brand} · {CATEGORY_ES[product.category] ?? capitalize(product.category)}
      </div>

      <div className="product-bottom">
        <div className="product-price">{pricePen}</div>
        <button className="add-to-cart" onClick={() => onAddToCart(product)}>
          {uiES.addToCart}
        </button>
        <div className="product-stock">{uiES.stock}: {product.stock}</div>
      </div>
    </article>
  );
}
