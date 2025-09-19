// LoginPage.test.tsx - Unit tests for LoginPage component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/pages/LoginPage';

// Mock the LoginForm component
jest.mock('@/modules/auth/components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form Mock</div>,
}));

describe('LoginPage Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render login page with correct structure', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveClass('login-page');
    });

    it('should render page title', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    });

    it('should render LoginForm component', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      renderWithRouter(<LoginPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('login-page');

      const formContainer = screen.getByText(/iniciar sesión/i).parentElement;
      expect(formContainer).toHaveClass('login-form');

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('login-title');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper semantic HTML structure', () => {
      renderWithRouter(<LoginPage />);

      // Check main element
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Check heading hierarchy
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      // Check that LoginForm is inside the form container
      const formContainer = heading.parentElement;
      expect(formContainer).toContainElement(screen.getByTestId('login-form'));
    });

    it('should render components in correct order', () => {
      renderWithRouter(<LoginPage />);

      const main = screen.getByRole('main');
      const children = Array.from(main.children);

      expect(children).toHaveLength(1);
      expect(children[0]).toHaveClass('login-form');

      const formChildren = Array.from(children[0].children);
      expect(formChildren[0].tagName.toLowerCase()).toBe('h1');
      expect(formChildren[1]).toHaveAttribute('data-testid', 'login-form');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithRouter(<LoginPage />);

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName.toLowerCase()).toBe('h1');
    });

    it('should use semantic main element', () => {
      renderWithRouter(<LoginPage />);

      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('should have accessible title text', () => {
      renderWithRouter(<LoginPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAccessibleName('Iniciar sesión');
    });
  });

  describe('Component Integration', () => {
    it('should properly integrate with LoginForm component', () => {
      renderWithRouter(<LoginPage />);

      // Verify LoginForm is rendered
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByText('Login Form Mock')).toBeInTheDocument();
    });

    it('should work within router context', () => {
      // Should not throw when rendered with MemoryRouter
      expect(() => {
        renderWithRouter(<LoginPage />);
      }).not.toThrow();

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to elements', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByRole('main')).toHaveClass('login-page');
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('login-title');
      
      const formContainer = title.parentElement;
      expect(formContainer).toHaveClass('login-form');
    });

    it('should not have additional unexpected classes', () => {
      renderWithRouter(<LoginPage />);

      const main = screen.getByRole('main');
      expect(main.className).toBe('login-page');

      const title = screen.getByRole('heading', { level: 1 });
      expect(title.className).toBe('login-title');
    });
  });

  describe('Content Verification', () => {
    it('should display correct title text', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('should not display any other text content', () => {
      renderWithRouter(<LoginPage />);

      // Only the title and mocked LoginForm content should be present
      expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
      expect(screen.getByText('Login Form Mock')).toBeInTheDocument();
      
      // Should not have any other text
      const textElements = screen.getAllByText(/./);
      expect(textElements).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should render correctly with different router configurations', () => {
      // Test with different initial entries
      render(
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    });

    it('should handle re-renders correctly', () => {
      const { rerender } = renderWithRouter(<LoginPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();

      // Re-render should work fine
      rerender(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render without performance issues', () => {
      const startTime = performance.now();
      renderWithRouter(<LoginPage />);
      const endTime = performance.now();

      // Should render quickly (less than 100ms in tests)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithRouter(<LoginPage />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});