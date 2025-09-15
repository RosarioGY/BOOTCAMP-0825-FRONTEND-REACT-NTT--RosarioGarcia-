// routes.tsx - Route definitions
import { ROUTES } from '../../shared/constants/routes';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { HomePage } from '../../modules/home/pages/HomePage';
import { CartPage } from '../../modules/cart/pages/CartPage';
import { SummaryPage } from '../../modules/cart/pages/SummaryPage';
import { withAuthGuard } from './withAuthGuard';

const ProtectedHomePage = withAuthGuard(HomePage);
const ProtectedCartPage = withAuthGuard(CartPage);
const ProtectedSummaryPage = withAuthGuard(SummaryPage);

export interface AppRoute {
  path: string;
  element: React.ReactElement;
  isProtected?: boolean;
}

export const appRoutes: AppRoute[] = [
  { path: '/', element: <ProtectedHomePage />, isProtected: true },
  { path: ROUTES.login, element: <LoginPage />, isProtected: false },
  { path: ROUTES.register, element: <RegisterPage />, isProtected: false },
  { path: ROUTES.home, element: <ProtectedHomePage />, isProtected: true },
  { path: ROUTES.cart, element: <ProtectedCartPage />, isProtected: true },
  { path: ROUTES.summary, element: <ProtectedSummaryPage />, isProtected: true },
];
