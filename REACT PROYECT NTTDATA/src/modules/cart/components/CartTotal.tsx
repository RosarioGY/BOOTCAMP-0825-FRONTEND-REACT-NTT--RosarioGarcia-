import { formatPricePEN } from '@/shared/utils/locale';

export function CartTotal({ total }: { total: number }) {
  return (
    <div className="cart-total" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
      <span>Total:</span> <strong>{formatPricePEN(total)}</strong>
    </div>
  );
}
