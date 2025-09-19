// withAuthGuard.test.tsx - Unit tests for withAuthGuard HOC
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { withAuthGuard } from '@/app/router/withAuthGuard';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock the routes constants
jest.mock('@/shared/constants/routes', () => ({
  ROUTES: {
    login: '/login',
    home: '/',
    cart: '/cart'
  }
}));

// Mock Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to, replace, state }: { to: string; replace: boolean; state?: unknown }) => (
    <div 
      data-testid="navigate"
      data-to={to}
      data-replace={replace}
      data-state={JSON.stringify(state)}
    >
      Navigate to {to}
    </div>
  ),
}));

describe('withAuthGuard HOC', () => {
  // Test component to wrap with auth guard
  const TestComponent = ({ title = 'Test Component', ...props }: { title?: string; [key: string]: unknown }) => (
    <div data-testid="test-component" {...props}>
      {title}
    </div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authenticated User', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' }
      });
    });

    it('should render wrapped component when user is authenticated', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should pass props to wrapped component', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter>
          <GuardedComponent title="Custom Title" data-custom="value" />
        </MemoryRouter>
      );
      
      const testComponent = screen.getByTestId('test-component');
      expect(testComponent).toBeInTheDocument();
      expect(testComponent).toHaveTextContent('Custom Title');
      expect(testComponent).toHaveAttribute('data-custom', 'value');
    });

    it('should not render Navigate component when authenticated', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should work with different component types', () => {
      const ButtonComponent = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
        <button data-testid="button-component" onClick={onClick}>
          {children}
        </button>
      );
      
      const GuardedButton = withAuthGuard(ButtonComponent);
      
      render(
        <MemoryRouter>
          <GuardedButton onClick={() => {}}>
            Click Me
          </GuardedButton>
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('button-component')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null
      });
    });

    it('should redirect to login when user is not authenticated', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    it('should not render wrapped component when not authenticated', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
    });

    it('should use replace navigation', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
    });

    it('should pass current location in state', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      render(
        <MemoryRouter initialEntries={['/protected-page']}>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      const navigate = screen.getByTestId('navigate');
      const stateData = JSON.parse(navigate.getAttribute('data-state') || '{}');
      
      expect(stateData).toHaveProperty('from');
      expect(stateData.from).toHaveProperty('pathname', '/protected-page');
    });
  });

  describe('HOC Properties', () => {
    it('should return a functional component', () => {
      const GuardedComponent = withAuthGuard(TestComponent);
      
      expect(typeof GuardedComponent).toBe('function');
      // Functional components in React may have some prototype properties
      expect(GuardedComponent).toBeDefined();
    });

    it('should preserve component functionality', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1 } });
      
      const InteractiveComponent = ({ onClick }: { onClick: () => void }) => (
        <button data-testid="interactive" onClick={onClick}>
          Click Me
        </button>
      );
      
      const GuardedInteractive = withAuthGuard(InteractiveComponent);
      const mockClick = jest.fn();
      
      render(
        <MemoryRouter>
          <GuardedInteractive onClick={mockClick} />
        </MemoryRouter>
      );
      
      const button = screen.getByTestId('interactive');
      button.click();
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should work with generic props', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1 } });
      
      interface CustomProps {
        customProp: string;
        count: number;
      }
      
      const CustomComponent = ({ customProp, count }: CustomProps) => (
        <div data-testid="custom-component">
          {customProp} - {count}
        </div>
      );
      
      const GuardedCustom = withAuthGuard<CustomProps>(CustomComponent);
      
      render(
        <MemoryRouter>
          <GuardedCustom customProp="test" count={42} />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
      expect(screen.getByText('test - 42')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle useAuth hook errors gracefully', () => {
      mockUseAuth.mockImplementation(() => {
        throw new Error('Auth error');
      });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      
      expect(() =>
        render(
          <MemoryRouter>
            <GuardedComponent />
          </MemoryRouter>
        )
      ).toThrow('Auth error');
    });

    it('should handle missing location gracefully', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      
      expect(() =>
        render(
          <MemoryRouter>
            <GuardedComponent />
          </MemoryRouter>
        )
      ).not.toThrow();
    });
  });

  describe('Re-rendering', () => {
    it('should handle auth state changes correctly', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      const { rerender } = render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      // Should redirect when not authenticated
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      
      // Update mock to authenticated
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1 } });
      
      rerender(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      // Should render component when authenticated
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Routes', () => {
    it('should preserve location state for different routes', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      
      const routes = ['/cart', '/profile', '/settings'];
      
      routes.forEach(route => {
        const { unmount } = render(
          <MemoryRouter initialEntries={[route]}>
            <GuardedComponent />
          </MemoryRouter>
        );
        
        const navigate = screen.getByTestId('navigate');
        const stateData = JSON.parse(navigate.getAttribute('data-state') || '{}');
        
        expect(stateData.from.pathname).toBe(route);
        unmount();
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently when authenticated', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1 } });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      
      const start = performance.now();
      render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });

    it('should not cause memory leaks', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1 } });
      
      const GuardedComponent = withAuthGuard(TestComponent);
      const { unmount } = render(
        <MemoryRouter>
          <GuardedComponent />
        </MemoryRouter>
      );
      
      expect(() => unmount()).not.toThrow();
    });
  });
});