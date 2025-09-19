// AppProviders.test.tsx - Unit tests for AppProviders component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AppProviders } from '@/app/providers/AppProviders';

// Mock the providers and router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="browser-router">{children}</div>
  ),
}));

jest.mock('@/modules/auth/context/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock('@/modules/cart/context', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

describe('AppProviders Component', () => {
  const TestChild = () => <div data-testid="test-child">Test Child</div>;

  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => 
        render(
          <AppProviders>
            <TestChild />
          </AppProviders>
        )
      ).not.toThrow();
    });

    it('should render children', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render all provider wrappers', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('should have correct provider nesting order', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      const browserRouter = screen.getByTestId('browser-router');
      const authProvider = screen.getByTestId('auth-provider');
      const cartProvider = screen.getByTestId('cart-provider');
      const testChild = screen.getByTestId('test-child');
      
      // BrowserRouter should contain AuthProvider
      expect(browserRouter).toContainElement(authProvider);
      
      // AuthProvider should contain CartProvider
      expect(authProvider).toContainElement(cartProvider);
      
      // CartProvider should contain the children
      expect(cartProvider).toContainElement(testChild);
    });

    it('should provide proper context structure', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      // Verify the nesting structure exists
      const browserRouter = screen.getByTestId('browser-router');
      const authProvider = screen.getByTestId('auth-provider');
      const cartProvider = screen.getByTestId('cart-provider');
      
      expect(browserRouter).toBeInTheDocument();
      expect(authProvider).toBeInTheDocument();
      expect(cartProvider).toBeInTheDocument();
    });
  });

  describe('Children Handling', () => {
    it('should render single child component', () => {
      render(
        <AppProviders>
          <div data-testid="single-child">Single Child</div>
        </AppProviders>
      );
      
      expect(screen.getByTestId('single-child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <AppProviders>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </AppProviders>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render complex children components', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      );
      
      render(
        <AppProviders>
          <ComplexChild />
        </AppProviders>
      );
      
      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle empty children gracefully', () => {
      expect(() => 
        render(<AppProviders>{null}</AppProviders>)
      ).not.toThrow();
    });
  });

  describe('Props Handling', () => {
    it('should accept and use children prop correctly', () => {
      const ChildComponent = () => <span data-testid="prop-child">Prop Child</span>;
      
      render(
        <AppProviders>
          <ChildComponent />
        </AppProviders>
      );
      
      expect(screen.getByTestId('prop-child')).toBeInTheDocument();
    });

    it('should handle ReactNode children type', () => {
      render(
        <AppProviders>
          <div>Text Node</div>
          {42}
          {'String Node'}
        </AppProviders>
      );
      
      expect(screen.getByText('Text Node')).toBeInTheDocument();
      expect(screen.getByText(/42/)).toBeInTheDocument();
      expect(screen.getByText('String Node')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with router navigation context', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      // Should render BrowserRouter which provides routing context
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    it('should provide authentication context', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      // Should render AuthProvider which provides auth context
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should provide cart context', () => {
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      // Should render CartProvider which provides cart context
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should not crash with invalid children', () => {
      expect(() => 
        render(
          <AppProviders>
            {undefined}
            {false}
            {null}
          </AppProviders>
        )
      ).not.toThrow();
    });
  });

  describe('Re-rendering', () => {
    it('should handle re-renders correctly', () => {
      const { rerender } = render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      
      rerender(
        <AppProviders>
          <div data-testid="new-child">New Child</div>
        </AppProviders>
      );
      
      expect(screen.getByTestId('new-child')).toBeInTheDocument();
    });

    it('should maintain provider structure on re-render', () => {
      const { rerender } = render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      rerender(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const start = performance.now();
      
      render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      const end = performance.now();
      
      // Should render quickly (less than 50ms)
      expect(end - start).toBeLessThan(50);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(
        <AppProviders>
          <TestChild />
        </AppProviders>
      );
      
      expect(() => unmount()).not.toThrow();
    });
  });
});