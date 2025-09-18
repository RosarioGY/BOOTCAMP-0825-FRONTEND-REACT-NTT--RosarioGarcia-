import CheckoutForm, { type CheckoutData } from '@/modules/cart/components/CheckoutForm';
import { useCart } from '@/modules/cart/hooks/useCart';
import { Modal } from '@/shared/components/ui/Modal';
import { Alert } from '@/shared/components/ui/Alert';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { formatPricePEN } from '@/shared/utils/locale';
import { Layout } from '@/shared/components/layout/Layout';

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
    <Layout>
      <div className="app-container">
        <section className="cart-card">
          <h1 className="cart-title">Resumen de compras</h1>

          {items.length === 0 ? (
            <p style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>Tu carrito está vacío.</p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td><img className="cart-img" src={item.thumbnail} alt={item.title} /></td>
                      <td>
                        {item.title}
                        <div className="stock">Stock: {item.stock}</div>
                      </td>
                      <td className="col-price">{formatPricePEN(item.price)}</td>
                      <td>
                        <div className="qty">
                          <button 
                            className="qty-btn" 
                            onClick={() => dec(item.id)}
                            disabled={item.qty <= 1}
                          >
                            −
                          </button>
                          <input className="qty-input" value={item.qty} readOnly />
                          <button 
                            className="qty-btn" 
                            onClick={() => onInc(item.id)}
                            disabled={item.qty >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className="btn-delete" onClick={() => remove(item.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-total">
                <span>Total:</span> <strong>{formatPricePEN(totalPrice)}</strong>
              </div>
            </>
          )}

          <CheckoutForm disabled={items.length === 0} onSuccess={onBuySuccess} />
        </section>

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
      </div>
    </Layout>
  );
}
