// CartPage.test.tsx - Unit tests for CartPage component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartPage } from '@/modules/cart/pages/CartPage';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import type { User } from '@/modules/auth/types/auth.types';

// Mock Layout component
jest.mock('@/shared/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

// Mock useAuth hook with different scenarios
const mockUseAuth = jest.fn();
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

describe('CartPage Component', () => {
  const renderCartPage = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <CartPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render cart page with layout', () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
      expect(screen.getByText('Usuario: testuser')).toBeInTheDocument();
    });

    it('should render with correct page structure', () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      const cartPageDiv = screen.getByText('Carrito de Compras').closest('.cart-page');
      expect(cartPageDiv).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Carrito de Compras');
    });

    it('should handle null user', () => {
      mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false });

      renderCartPage();

      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
      expect(screen.getByText('Usuario:')).toBeInTheDocument();
      expect(screen.queryByText('Usuario: testuser')).not.toBeInTheDocument();
    });

    it('should handle undefined user', () => {
      mockUseAuth.mockReturnValue({ user: undefined, isAuthenticated: false });

      renderCartPage();

      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
      expect(screen.getByText('Usuario:')).toBeInTheDocument();
    });
  });

  describe('User Information Display', () => {
    it('should display different usernames correctly', () => {
      const testCases = ['admin', 'user123', 'maría@example', ''];

      testCases.forEach(username => {
        const mockUser: User = {
          id: 1,
          username,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          gender: 'male',
          image: 'avatar.jpg',
          accessToken: 'token'
        };

        mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

        const { unmount } = renderCartPage();

        if (username) {
          expect(screen.getByText(`Usuario: ${username}`)).toBeInTheDocument();
        } else {
          expect(screen.getByText('Usuario:')).toBeInTheDocument();
        }

        unmount();
      });
    });

    it('should handle user with special characters in username', () => {
      const mockUser: User = {
        id: 1,
        username: 'user@123_test.name',
        firstName: 'Special',
        lastName: 'User',
        email: 'special@example.com',
        gender: 'female',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByText('Usuario: user@123_test.name')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should work within router context', () => {
      const mockUser: User = {
        id: 1,
        username: 'routeruser',
        firstName: 'Router',
        lastName: 'User',
        email: 'router@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
    });

    it('should integrate with Layout component', () => {
      const mockUser: User = {
        id: 1,
        username: 'layoutuser',
        firstName: 'Layout',
        lastName: 'User',
        email: 'layout@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('layout')).toContainElement(screen.getByText('Carrito de Compras'));
    });
  });

  describe('Authentication States', () => {
    it('should handle authenticated user', () => {
      const mockUser: User = {
        id: 1,
        username: 'authenticated',
        firstName: 'Auth',
        lastName: 'User',
        email: 'auth@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByText('Usuario: authenticated')).toBeInTheDocument();
    });

    it('should handle unauthenticated state', () => {
      mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false });

      renderCartPage();

      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
      expect(screen.getByText('Usuario:')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const mockUser: User = {
        id: 1,
        username: 'a11yuser',
        firstName: 'A11Y',
        lastName: 'User',
        email: 'a11y@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Carrito de Compras');
    });

    it('should have semantic page structure', () => {
      const mockUser: User = {
        id: 1,
        username: 'semantic',
        firstName: 'Semantic',
        lastName: 'User',
        email: 'semantic@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS class to cart page container', () => {
      const mockUser: User = {
        id: 1,
        username: 'cssuser',
        firstName: 'CSS',
        lastName: 'User',
        email: 'css@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      renderCartPage();

      const cartPageDiv = screen.getByText('Carrito de Compras').closest('.cart-page');
      expect(cartPageDiv).toHaveClass('cart-page');
    });
  });

  describe('Error Handling', () => {
    it('should handle useAuth hook errors gracefully', () => {
      mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false });

      expect(() => renderCartPage()).not.toThrow();
    });

    it('should handle missing user properties', () => {
      const incompleteUser = {
        id: 1,
        username: 'incomplete'
        // Missing other properties
      } as User;

      mockUseAuth.mockReturnValue({ user: incompleteUser, isAuthenticated: true });

      renderCartPage();

      expect(screen.getByText('Usuario: incomplete')).toBeInTheDocument();
    });
  });

  describe('Re-renders', () => {
    it('should handle re-renders correctly', () => {
      const mockUser: User = {
        id: 1,
        username: 'rerender',
        firstName: 'Rerender',
        lastName: 'User',
        email: 'rerender@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

      const { rerender } = renderCartPage();

      expect(screen.getByText('Usuario: rerender')).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <AuthProvider>
            <CartPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Usuario: rerender')).toBeInTheDocument();
    });

    it('should handle user changes on re-render', () => {
      const initialUser: User = {
        id: 1,
        username: 'initial',
        firstName: 'Initial',
        lastName: 'User',
        email: 'initial@example.com',
        gender: 'male',
        image: 'avatar.jpg',
        accessToken: 'token'
      };

      mockUseAuth.mockReturnValue({ user: initialUser, isAuthenticated: true });

      const { rerender } = renderCartPage();

      expect(screen.getByText('Usuario: initial')).toBeInTheDocument();

      // Change user
      const updatedUser: User = {
        ...initialUser,
        username: 'updated'
      };

      mockUseAuth.mockReturnValue({ user: updatedUser, isAuthenticated: true });

      rerender(
        <MemoryRouter>
          <AuthProvider>
            <CartPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Usuario: updated')).toBeInTheDocument();
    });
  });
});