// withAuthGuard.tsx - Authentication guard HOC
import type { ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { ROUTES } from '../../shared/constants/routes';

export function withAuthGuard<P extends object>(Wrapped: ComponentType<P>) {
  return function Guarded(props: P) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (!isAuthenticated) {
      return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
    }
    
    return <Wrapped {...(props as P)} />;
  };
}
