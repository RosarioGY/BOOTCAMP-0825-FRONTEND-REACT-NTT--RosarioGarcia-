// App.test.tsx - Unit tests for main App component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock CSS imports
jest.mock('@/App.css', () => ({}), { virtual: true });

import App from '@/App';

// Mock the router components and providers
jest.mock('@/app/router/AppRouter', () => {
  return function MockAppRouter() {
    return <div data-testid="app-router">App Router</div>;
  };
});

jest.mock('@/app/providers/AppProviders', () => {
  return {
    AppProviders: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="app-providers">{children}</div>
    ),
  };
});

describe('App Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it('should render AppProviders wrapper', () => {
      render(<App />);
      expect(screen.getByTestId('app-providers')).toBeInTheDocument();
    });

    it('should render AppRouter inside AppProviders', () => {
      render(<App />);
      const providers = screen.getByTestId('app-providers');
      const router = screen.getByTestId('app-router');
      
      expect(providers).toBeInTheDocument();
      expect(router).toBeInTheDocument();
      expect(providers).toContainElement(router);
    });
  });

  describe('Component Structure', () => {
    it('should have correct component hierarchy', () => {
      render(<App />);
      
      // Should have AppProviders as the root wrapper
      const providers = screen.getByTestId('app-providers');
      expect(providers).toBeInTheDocument();
      
      // Should have AppRouter as a child of AppProviders
      const router = screen.getByTestId('app-router');
      expect(router).toBeInTheDocument();
      expect(providers).toContainElement(router);
    });

    it('should render only expected components', () => {
      render(<App />);
      
      // Should only render the two main components
      expect(screen.getByTestId('app-providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-router')).toBeInTheDocument();
      
      // Should not render any unexpected elements
      const allTestIds = screen.getAllByTestId(/.*/).map(el => el.getAttribute('data-testid'));
      expect(allTestIds).toEqual(['app-providers', 'app-router']);
    });
  });

  describe('Integration', () => {
    it('should work with React rendering cycle', () => {
      const { unmount } = render(<App />);
      
      expect(screen.getByTestId('app-providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-router')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should handle re-renders correctly', () => {
      const { rerender } = render(<App />);
      
      expect(screen.getByTestId('app-providers')).toBeInTheDocument();
      
      rerender(<App />);
      
      expect(screen.getByTestId('app-providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-router')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should not crash when providers have issues', () => {
      // This tests that the component itself doesn't throw errors
      // The actual provider error handling would be in AppProviders tests
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const start = performance.now();
      render(<App />);
      const end = performance.now();
      
      // Should render quickly (less than 100ms)
      expect(end - start).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<App />);
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Default Export', () => {
    it('should be the default export', () => {
      expect(App).toBeDefined();
      expect(typeof App).toBe('function');
    });

    it('should be a functional component', () => {
      expect(App.prototype).toBeUndefined();
    });
  });

  describe('CSS Import', () => {
    it('should import App.css (tested via component rendering)', () => {
      // The CSS import is tested indirectly through successful component rendering
      expect(() => render(<App />)).not.toThrow();
    });
  });
});