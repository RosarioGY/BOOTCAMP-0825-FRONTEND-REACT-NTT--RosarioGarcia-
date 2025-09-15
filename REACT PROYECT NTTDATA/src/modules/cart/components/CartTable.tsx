import type { CartItem } from '../types/cart.types';
import QuantityControl from './QuantityControl';

type Props = {
  items: CartItem[];
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function CartTable({ items, onInc, onDec, onRemove }: Props) {
  if (items.length === 0)
    return <p style={{ padding: 16 }}>Tu carrito está vacío.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left' }}>
          <th style={{ padding: 8 }}>Producto</th>
          <th style={{ padding: 8 }}>Nombre</th>
          <th style={{ padding: 8 }}>Precio</th>
          <th style={{ padding: 8 }}>Cantidad</th>
          <th style={{ padding: 8 }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map(it => (
          <tr key={it.id} style={{ borderTop: '1px solid #e5e7eb' }}>
            <td style={{ padding: 8, width: 90 }}>
              <img src={it.thumbnail} alt={it.title} style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8 }} />
            </td>
            <td style={{ padding: 8 }}>{it.title}</td>
            <td style={{ padding: 8 }}>${it.price.toFixed(2)}</td>
            <td style={{ padding: 8 }}>
              <QuantityControl
                qty={it.qty}
                onInc={() => onInc(it.id)}
                onDec={() => onDec(it.id)}
                disabledInc={it.qty >= it.stock}
              />
              <small style={{ display: 'block', color: '#64748b' }}>Stock: {it.stock}</small>
            </td>
            <td style={{ padding: 8 }}>
              <button onClick={() => onRemove(it.id)} style={{ border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '4px 8px' }}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
