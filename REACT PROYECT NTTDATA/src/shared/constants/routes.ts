// routes.ts - Route constants
export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  home: '/home',
  cart: '/cart',
  summary: '/summary',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = typeof ROUTES[RouteKeys];
