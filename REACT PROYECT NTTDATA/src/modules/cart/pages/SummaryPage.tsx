import CartTable from '../components/CartTable';
import { CartTotal } from '../components/CartTotal';
import CheckoutForm, { type CheckoutData } from '../components/CheckoutForm';
import { useCart } from '../hooks/useCart';
import { Modal } from '../../../shared/components/ui/Modal';
import { Alert } from '../../../shared/components/ui/Alert';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export function SummaryPage() {
  const { items, totalPrice, inc, dec, remove, clear } = useCart();
  const [stockMsg, setStockMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<CheckoutData | null>(null);
  const nav = useNavigate();

  const onInc = (id: number) => {
    const res = inc(id);
    if (res === 'out_of_stock') {
      const it = items.find(i => i.id === id);
      setStockMsg(`Ya no hay más stock para "${it?.title ?? 'este producto'}".`);
    }
  };

  const onBuySuccess = (data: CheckoutData) => {
    // 1) Mostrar alerta personalizada
    setSuccess(data);
    // 2) Log de estructura solicitada
    console.log({ ...data, items });
  };

  const onAcceptSuccess = () => {
    setSuccess(null);
    clear();
    nav(ROUTES.home, { replace: true }); // 3) limpiar y redirigir
  };

  return (
    <section style={{ padding: 16, display: 'grid', gap: 16 }}>
      <h2>Resumen de compras</h2>

      <CartTable items={items} onInc={onInc} onDec={dec} onRemove={remove} />
      <CartTotal total={totalPrice} />
      <CheckoutForm disabled={items.length === 0} onSuccess={onBuySuccess} />

      <Modal isOpen={!!stockMsg} onClose={() => setStockMsg(null)} title="Stock insuficiente">
        <Alert type="warning" message={stockMsg || ''} />
      </Modal>

      <Modal isOpen={!!success} onClose={onAcceptSuccess} title="Compra exitosa">
        <Alert type="success" message="¡Tu pedido se registró con éxito! Pronto recibirás la confirmación por correo." />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onAcceptSuccess} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #334155' }}>
            Aceptar
          </button>
        </div>
      </Modal>
    </section>
  );
}
