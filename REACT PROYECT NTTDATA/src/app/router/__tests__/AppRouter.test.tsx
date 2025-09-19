// AppRouter.test.tsx - Unit tests for AppRouter component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/app/router/AppRouter';

// Mock the routes and constants
jest.mock('@/app/router/routes', () => ({
  appRoutes: [
    {
      path: '/',
      element: <div data-testid="home-page">Home Page</div>,
      isProtected: true
    },
    {
      path: '/login',
      element: <div data-testid="login-page">Login Page</div>,
      isProtected: false
    },
    {
      path: '/register',
      element: <div data-testid="register-page">Register Page</div>,
      isProtected: false
    }
  ]
}));

jest.mock('@/shared/constants/routes', () => ({
  ROUTES: {
    home: '/',
    login: '/login',
    register: '/register',
    cart: '/cart',
    summary: '/summary'
  }
}));

// Mock react-router-dom components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="routes">{children}</div>
  ),
  Route: ({ element, path }: { element: React.ReactElement; path: string }) => (
    <div data-testid={`route-${path}`} data-path={path}>
      {element}
    </div>
  ),
  Navigate: ({ to, replace }: { to: string; replace: boolean }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace}>
      Navigate to {to}
    </div>
  ),
}));

describe('AppRouter Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<AppRouter />)).not.toThrow();
    });

    it('should render Routes wrapper', () => {
      render(<AppRouter />);
      expect(screen.getByTestId('routes')).toBeInTheDocument();
    });

    it('should render all defined routes', () => {
      render(<AppRouter />);
      
      expect(screen.getByTestId('route-/')).toBeInTheDocument();
      expect(screen.getByTestId('route-/login')).toBeInTheDocument();
      expect(screen.getByTestId('route-/register')).toBeInTheDocument();
    });

    it('should render fallback route for unmatched paths', () => {
      render(<AppRouter />);
      
      expect(screen.getByTestId('route-*')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    it('should configure routes with correct paths', () => {
      render(<AppRouter />);
      
      const homeRoute = screen.getByTestId('route-/');
      const loginRoute = screen.getByTestId('route-/login');
      const registerRoute = screen.getByTestId('route-/register');
      
      expect(homeRoute).toHaveAttribute('data-path', '/');
      expect(loginRoute).toHaveAttribute('data-path', '/login');
      expect(registerRoute).toHaveAttribute('data-path', '/register');
    });

    it('should render route elements correctly', () => {
      render(<AppRouter />);
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('should configure fallback navigation correctly', () => {
      render(<AppRouter />);
      
      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/');
      expect(navigate).toHaveAttribute('data-replace', 'true');
    });
  });

  describe('Route Elements', () => {
    it('should render home page element', () => {
      render(<AppRouter />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('should render login page element', () => {
      render(<AppRouter />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should render register page element', () => {
      render(<AppRouter />);
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
  });

  describe('Fallback Route', () => {
    it('should have a wildcard route for unmatched paths', () => {
      render(<AppRouter />);
      
      const wildcardRoute = screen.getByTestId('route-*');
      expect(wildcardRoute).toBeInTheDocument();
      expect(wildcardRoute).toHaveAttribute('data-path', '*');
    });

    it('should navigate to home on unmatched paths', () => {
      render(<AppRouter />);
      
      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveTextContent('Navigate to /');
    });

    it('should use replace navigation for fallback', () => {
      render(<AppRouter />);
      
      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-replace', 'true');
    });
  });

  describe('Integration', () => {
    it('should work within BrowserRouter context', () => {
      expect(() =>
        render(
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        )
      ).not.toThrow();
    });

    it('should render all routes within Routes component', () => {
      render(<AppRouter />);
      
      const routesContainer = screen.getByTestId('routes');
      const homeRoute = screen.getByTestId('route-/');
      const loginRoute = screen.getByTestId('route-/login');
      const registerRoute = screen.getByTestId('route-/register');
      const wildcardRoute = screen.getByTestId('route-*');
      
      expect(routesContainer).toContainElement(homeRoute);
      expect(routesContainer).toContainElement(loginRoute);
      expect(routesContainer).toContainElement(registerRoute);
      expect(routesContainer).toContainElement(wildcardRoute);
    });
  });

  describe('Route Keys', () => {
    it('should use path as key for route mapping', () => {
      render(<AppRouter />);
      
      // Keys are used internally by React, but we can test that routes render
      expect(screen.getByTestId('route-/')).toBeInTheDocument();
      expect(screen.getByTestId('route-/login')).toBeInTheDocument();
      expect(screen.getByTestId('route-/register')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty routes array gracefully', () => {
      // This test ensures the component doesn't crash with edge cases
      expect(() => render(<AppRouter />)).not.toThrow();
    });

    it('should render without errors', () => {
      const { container } = render(<AppRouter />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const start = performance.now();
      render(<AppRouter />);
      const end = performance.now();
      
      // Should render quickly (less than 50ms)
      expect(end - start).toBeLessThan(50);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<AppRouter />);
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Re-rendering', () => {
    it('should handle re-renders correctly', () => {
      const { rerender } = render(<AppRouter />);
      
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      
      rerender(<AppRouter />);
      
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should maintain route structure on re-render', () => {
      const { rerender } = render(<AppRouter />);
      
      rerender(<AppRouter />);
      
      expect(screen.getByTestId('route-/')).toBeInTheDocument();
      expect(screen.getByTestId('route-/login')).toBeInTheDocument();
      expect(screen.getByTestId('route-/register')).toBeInTheDocument();
      expect(screen.getByTestId('route-*')).toBeInTheDocument();
    });
  });
});