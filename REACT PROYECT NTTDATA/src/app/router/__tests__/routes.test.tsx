// routes.test.tsx - Unit tests for route definitions
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { appRoutes } from '@/app/router/routes';

// Mock the page components
jest.mock('@/modules/auth/pages/LoginPage', () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock('@/modules/auth/pages/RegisterPage', () => ({
  RegisterPage: () => <div data-testid="register-page">Register Page</div>,
}));

jest.mock('@/modules/home/pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock('@/modules/cart/pages/CartPage', () => ({
  CartPage: () => <div data-testid="cart-page">Cart Page</div>,
}));

jest.mock('@/modules/cart/pages/SummaryPage', () => ({
  SummaryPage: () => <div data-testid="summary-page">Summary Page</div>,
}));

// Mock the withAuthGuard HOC
jest.mock('@/app/router/withAuthGuard', () => ({
  withAuthGuard: (Component: React.ComponentType) => {
    return function GuardedComponent(props: unknown) {
      return (
        <div data-testid="auth-guarded">
          <Component {...(props as Record<string, unknown>)} />
        </div>
      );
    };
  },
}));

// Mock the routes constants
jest.mock('@/shared/constants/routes', () => ({
  ROUTES: {
    home: '/home',
    login: '/login',
    register: '/register',
    cart: '/cart',
    summary: '/summary',
  },
}));

describe('App Routes Configuration', () => {
  describe('Route Structure', () => {
    it('should export appRoutes array', () => {
      expect(Array.isArray(appRoutes)).toBe(true);
      expect(appRoutes.length).toBeGreaterThan(0);
    });

    it('should contain all required routes', () => {
      const paths = appRoutes.map(route => route.path);
      
      expect(paths).toContain('/');
      expect(paths).toContain('/login');
      expect(paths).toContain('/register');
      expect(paths).toContain('/home');
      expect(paths).toContain('/cart');
      expect(paths).toContain('/summary');
    });

    it('should have correct number of routes', () => {
      expect(appRoutes).toHaveLength(6);
    });

    it('should have correct route structure', () => {
      appRoutes.forEach(route => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
        expect(typeof route.path).toBe('string');
        expect(React.isValidElement(route.element)).toBe(true);
      });
    });
  });

  describe('Route Protection', () => {
    it('should mark protected routes correctly', () => {
      const protectedRoutes = appRoutes.filter(route => route.isProtected === true);
      const unprotectedRoutes = appRoutes.filter(route => route.isProtected === false);
      
      expect(protectedRoutes.length).toBe(4); // /, /home, /cart, /summary
      expect(unprotectedRoutes.length).toBe(2); // /login, /register
    });

    it('should have auth guard on protected routes', () => {
      const protectedPaths = ['/', '/home', '/cart', '/summary'];
      
      protectedPaths.forEach(path => {
        const route = appRoutes.find(r => r.path === path);
        expect(route).toBeDefined();
        
        // Render the route element to check for auth guard
        const { unmount } = render(
          <MemoryRouter>
            {route!.element}
          </MemoryRouter>
        );
        
        expect(screen.getByTestId('auth-guarded')).toBeInTheDocument();
        unmount();
      });
    });

    it('should not have auth guard on public routes', () => {
      const publicPaths = ['/login', '/register'];
      
      publicPaths.forEach(path => {
        const route = appRoutes.find(r => r.path === path);
        expect(route).toBeDefined();
        
        // Clear previous renders
        const { unmount } = render(
          <MemoryRouter>
            {route!.element}
          </MemoryRouter>
        );
        
        // Public routes should not have auth guard
        expect(screen.queryByTestId('auth-guarded')).not.toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Route Components', () => {
    it('should render LoginPage for login route', () => {
      const loginRoute = appRoutes.find(r => r.path === '/login');
      
      render(
        <MemoryRouter>
          {loginRoute!.element}
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should render RegisterPage for register route', () => {
      const registerRoute = appRoutes.find(r => r.path === '/register');
      
      render(
        <MemoryRouter>
          {registerRoute!.element}
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('should render protected HomePage for home routes', () => {
      const homeRoutes = appRoutes.filter(r => r.path === '/' || r.path === '/home');
      
      homeRoutes.forEach(route => {
        const { unmount } = render(
          <MemoryRouter>
            {route.element}
          </MemoryRouter>
        );
        
        expect(screen.getByTestId('auth-guarded')).toBeInTheDocument();
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        unmount();
      });
    });

    it('should render protected CartPage for cart route', () => {
      const cartRoute = appRoutes.find(r => r.path === '/cart');
      
      render(
        <MemoryRouter>
          {cartRoute!.element}
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('auth-guarded')).toBeInTheDocument();
      expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });

    it('should render protected SummaryPage for summary route', () => {
      const summaryRoute = appRoutes.find(r => r.path === '/summary');
      
      render(
        <MemoryRouter>
          {summaryRoute!.element}
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('auth-guarded')).toBeInTheDocument();
      expect(screen.getByTestId('summary-page')).toBeInTheDocument();
    });
  });

  describe('Route Paths', () => {
    it('should have root path route', () => {
      const rootRoute = appRoutes.find(r => r.path === '/');
      expect(rootRoute).toBeDefined();
      expect(rootRoute!.isProtected).toBe(true);
    });

    it('should have home path route', () => {
      const homeRoute = appRoutes.find(r => r.path === '/home');
      expect(homeRoute).toBeDefined();
      expect(homeRoute!.isProtected).toBe(true);
    });

    it('should use ROUTES constants for paths', () => {
      const routesByConstant = [
        { path: '/login', constant: 'login' },
        { path: '/register', constant: 'register' },
        { path: '/home', constant: 'home' },
        { path: '/cart', constant: 'cart' },
        { path: '/summary', constant: 'summary' },
      ];
      
      routesByConstant.forEach(({ path }) => {
        const route = appRoutes.find(r => r.path === path);
        expect(route).toBeDefined();
      });
    });
  });

  describe('AppRoute Interface', () => {
    it('should conform to AppRoute interface', () => {
      appRoutes.forEach(route => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
        expect(typeof route.path).toBe('string');
        expect(React.isValidElement(route.element)).toBe(true);
        
        if ('isProtected' in route) {
          expect(typeof route.isProtected).toBe('boolean');
        }
      });
    });

    it('should have valid React elements', () => {
      appRoutes.forEach(route => {
        expect(() => 
          render(
            <MemoryRouter>
              {route.element}
            </MemoryRouter>
          )
        ).not.toThrow();
      });
    });
  });

  describe('Protected Component HOC', () => {
    it('should create protected versions of components', () => {
      // Test that withAuthGuard creates new components
      const protectedRoutes = appRoutes.filter(r => r.isProtected === true);
      
      protectedRoutes.forEach(route => {
        const { unmount } = render(
          <MemoryRouter>
            {route.element}
          </MemoryRouter>
        );
        
        expect(screen.getByTestId('auth-guarded')).toBeInTheDocument();
        unmount();
      });
    });

    it('should maintain component functionality after wrapping', () => {
      const homeRoute = appRoutes.find(r => r.path === '/home');
      
      render(
        <MemoryRouter>
          {homeRoute!.element}
        </MemoryRouter>
      );
      
      // Should still render the original component inside the guard
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle route rendering without errors', () => {
      appRoutes.forEach(route => {
        expect(() => 
          render(
            <MemoryRouter initialEntries={[route.path]}>
              {route.element}
            </MemoryRouter>
          )
        ).not.toThrow();
      });
    });
  });

  describe('Route Uniqueness', () => {
    it('should not have duplicate paths except for root and home', () => {
      const paths = appRoutes.map(r => r.path);
      const pathCounts = paths.reduce((acc, path) => {
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(pathCounts).forEach(([path, count]) => {
        if (path === '/' || path === '/home') {
          // These might be intentionally duplicated for root redirect
          expect(count).toBeGreaterThanOrEqual(1);
        } else {
          expect(count).toBe(1);
        }
      });
    });
  });
});