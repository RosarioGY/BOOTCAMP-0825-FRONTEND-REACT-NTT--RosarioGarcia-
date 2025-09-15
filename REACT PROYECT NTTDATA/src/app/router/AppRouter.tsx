// AppRouter.tsx - Main application router
import { Routes, Route, Navigate } from 'react-router-dom';
import { appRoutes } from '@/app/router/routes';
import { ROUTES } from '@/shared/constants/routes';

export default function AppRouter() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      {/* Fallback route for unmatched paths */}
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
