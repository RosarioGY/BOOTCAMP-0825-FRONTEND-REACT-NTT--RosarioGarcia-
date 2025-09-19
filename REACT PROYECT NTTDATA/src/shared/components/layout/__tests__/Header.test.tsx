// Header.test.tsx - Unit tests for Header component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '@/shared/components/layout/Header';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useCart hook
const mockUseCart = jest.fn();
jest.mock('@/modules/cart/hooks/useCart', () => ({
  useCart: () => mockUseCart(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} data-testid="link">{children}</a>
  ),
  useNavigate: () => jest.fn(),
}));

// Component wrapper with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock returns
    mockUseCart.mockReturnValue({
      totalUnique: 0,
      items: [],
      add: jest.fn(),
      inc: jest.fn(),
      dec: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render header component', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render with correct structure', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');
    });
  });

  describe('Authentication States', () => {
    it('should render login and register links when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Registrarse')).toBeInTheDocument();
    });

    it('should render user info and logout when authenticated', () => {
      const mockLogout = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser', email: 'test@test.com' },
        logout: mockLogout,
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hola, testuser')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
      expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
      expect(screen.queryByText('Registrarse')).not.toBeInTheDocument();
    });

    it('should handle user without username', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { email: 'test@test.com' },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hola, Usuario')).toBeInTheDocument();
    });

    it('should handle null user when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hola, Usuario')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render home link', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const homeLink = screen.getByText('Tienda Virtual');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.closest('a')).toHaveAttribute('href', '/home');
    });

    it('should render cart link when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const cartLink = screen.getByText('Carrito');
      expect(cartLink).toBeInTheDocument();
      expect(cartLink.closest('a')).toHaveAttribute('href', '/cart');
    });

    it('should not render cart link when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.queryByText('Carrito')).not.toBeInTheDocument();
    });

    it('should have correct login link', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const loginLink = screen.getByText('Iniciar Sesión');
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });

    it('should have correct register link', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const registerLink = screen.getByText('Registrarse');
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('Logout Functionality', () => {
    it('should call logout function when logout button is clicked', () => {
      const mockLogout = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: mockLogout,
      });

      renderWithRouter(<Header />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should render logout as button element', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      expect(logoutButton.tagName.toLowerCase()).toBe('button');
    });

    it('should handle multiple logout clicks', () => {
      const mockLogout = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: mockLogout,
      });

      renderWithRouter(<Header />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(2);
    });
  });

  describe('User Display', () => {
    it('should display different usernames correctly', () => {
      const testCases = [
        'john_doe',
        'admin',
        'user123',
        'María García',
        'test-user',
      ];

      testCases.forEach(username => {
        mockUseAuth.mockReturnValue({
          isAuthenticated: true,
          user: { username },
          logout: jest.fn(),
        });

        const { unmount } = renderWithRouter(<Header />);
        
        expect(screen.getByText(`Hola, ${username}`)).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should handle empty username', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: '' },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hola, Usuario')).toBeInTheDocument();
    });

    it('should handle undefined username', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: undefined },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hola, Usuario')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('should apply header CSS class', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');
    });

    it('should apply navigation CSS classes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic header structure', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have accessible logout button', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: jest.fn(),
      });

      renderWithRouter(<Header />);
      
      const logoutButton = screen.getByRole('button', { name: 'Cerrar Sesión' });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle useAuth hook errors gracefully', () => {
      mockUseAuth.mockImplementation(() => {
        throw new Error('useAuth error');
      });

      expect(() => renderWithRouter(<Header />)).toThrow('useAuth error');
    });

    it('should handle logout function errors gracefully', () => {
      const mockLogout = jest.fn(() => {
        throw new Error('Logout failed');
      });
      
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: mockLogout,
      });

      renderWithRouter(<Header />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      
      expect(() => fireEvent.click(logoutButton)).toThrow('Logout failed');
    });
  });

  describe('Re-renders and State Changes', () => {
    it('should handle authentication state changes', () => {
      const { rerender } = renderWithRouter(<Header />);
      
      // Initially not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });
      
      rerender(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      
      // Then authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: jest.fn(),
      });
      
      rerender(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Hola, testuser')).toBeInTheDocument();
    });
  });
});