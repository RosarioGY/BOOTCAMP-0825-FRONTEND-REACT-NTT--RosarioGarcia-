import { Link } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { useCart } from '../../../modules/cart/hooks/useCart';
import { ROUTES } from '../../constants/routes';

export default function Header() {
  const { user, logout } = useAuth();
  const { totalUnique } = useCart();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, background: '#fff', zIndex: 50
    }}>
      <Link to={ROUTES.home} style={{ textDecoration: 'none', fontWeight: 800 }}>My Market</Link>

      <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to={ROUTES.summary} style={{ position: 'relative', textDecoration: 'none' }}>
          🛒
          {totalUnique > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -10, fontSize: 12,
              background: '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 6px'
            }}>
              {totalUnique}
            </span>
          )}
        </Link>

        {user && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>Hola, {user.firstName ?? user.username}</span>
            <button onClick={logout} style={{ border: '1px solid #64748b', borderRadius: 8, padding: '4px 8px' }}>
              Salir
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
