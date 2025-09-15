// CartPage.tsx - Cart page component
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Layout } from '@/shared/components/layout/Layout';

export function CartPage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        <p>Usuario: {user?.username}</p>
        {/* TODO: Implementar funcionalidad del carrito */}
      </div>
    </Layout>
  );
}