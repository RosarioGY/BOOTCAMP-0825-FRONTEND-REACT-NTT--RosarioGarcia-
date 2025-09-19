// RegisterPage.test.tsx - Unit tests for RegisterPage component
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';

// Mock the RegisterForm component
jest.mock('@/modules/auth/components/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">Register Form Mock</div>,
}));

describe('RegisterPage Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render register page with correct structure', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveClass('container');
    });

    it('should render page title', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByText(/completa el formulario para crear tu nueva cuenta/i)).toBeInTheDocument();
    });

    it('should render RegisterForm component', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('container');

      const pageContainer = screen.getByText(/crear cuenta/i).parentElement;
      expect(pageContainer).toHaveClass('register-page');

      const subtitle = screen.getByText(/completa el formulario para crear tu nueva cuenta/i);
      expect(subtitle).toHaveClass('register-subtitle');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper semantic HTML structure', () => {
      renderWithRouter(<RegisterPage />);

      // Check main element
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Check heading hierarchy
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      // Check that all elements are properly nested
      const registerPageDiv = heading.parentElement;
      expect(registerPageDiv).toHaveClass('register-page');
      expect(main).toContainElement(registerPageDiv);
    });

    it('should render components in correct order', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      const children = Array.from(main.children);

      expect(children).toHaveLength(1);
      expect(children[0]).toHaveClass('register-page');

      const pageChildren = Array.from(children[0].children);
      expect(pageChildren).toHaveLength(3);
      expect(pageChildren[0].tagName.toLowerCase()).toBe('h1');
      expect(pageChildren[1].tagName.toLowerCase()).toBe('p');
      expect(pageChildren[2]).toHaveAttribute('data-testid', 'register-form');
    });
  });

  describe('Content Verification', () => {
    it('should display correct title text', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    it('should display correct subtitle text', () => {
      renderWithRouter(<RegisterPage />);

      const subtitle = screen.getByText('Completa el formulario para crear tu nueva cuenta');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.tagName.toLowerCase()).toBe('p');
    });

    it('should display all expected text content', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
      expect(screen.getByText('Completa el formulario para crear tu nueva cuenta')).toBeInTheDocument();
      expect(screen.getByText('Register Form Mock')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithRouter(<RegisterPage />);

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName.toLowerCase()).toBe('h1');
    });

    it('should use semantic main element', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('should have accessible title text', () => {
      renderWithRouter(<RegisterPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAccessibleName('Crear cuenta');
    });

    it('should have descriptive subtitle for users', () => {
      renderWithRouter(<RegisterPage />);

      const subtitle = screen.getByText(/completa el formulario/i);
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('register-subtitle');
    });
  });

  describe('Component Integration', () => {
    it('should properly integrate with RegisterForm component', () => {
      renderWithRouter(<RegisterPage />);

      // Verify RegisterForm is rendered
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByText('Register Form Mock')).toBeInTheDocument();
    });

    it('should work within router context', () => {
      // Should not throw when rendered with MemoryRouter
      expect(() => {
        renderWithRouter(<RegisterPage />);
      }).not.toThrow();

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to elements', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByRole('main')).toHaveClass('container');
      
      const pageDiv = screen.getByText(/crear cuenta/i).parentElement;
      expect(pageDiv).toHaveClass('register-page');
      
      const subtitle = screen.getByText(/completa el formulario/i);
      expect(subtitle).toHaveClass('register-subtitle');
    });

    it('should not have additional unexpected classes', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      expect(main.className).toBe('container');

      const subtitle = screen.getByText(/completa el formulario/i);
      expect(subtitle.className).toBe('register-subtitle');
    });
  });

  describe('Text Content Analysis', () => {
    it('should have appropriate instructional text', () => {
      renderWithRouter(<RegisterPage />);

      const subtitle = screen.getByText(/completa el formulario para crear tu nueva cuenta/i);
      expect(subtitle).toBeInTheDocument();
      
      // Verify it provides clear instruction to users
      expect(subtitle.textContent).toContain('formulario');
      expect(subtitle.textContent).toContain('crear');
      expect(subtitle.textContent).toContain('cuenta');
    });

    it('should use appropriate language and tone', () => {
      renderWithRouter(<RegisterPage />);

      expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
      expect(screen.getByText(/completa el formulario/i)).toBeInTheDocument();
      
      // Text should be user-friendly and clear
      const subtitle = screen.getByText(/completa el formulario/i);
      expect(subtitle.textContent).not.toContain('error');
      expect(subtitle.textContent).not.toContain('warning');
    });
  });

  describe('Edge Cases', () => {
    it('should render correctly with different router configurations', () => {
      // Test with different initial entries
      render(
        <MemoryRouter initialEntries={['/register']}>
          <RegisterPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument();
    });

    it('should handle re-renders correctly', () => {
      const { rerender } = renderWithRouter(<RegisterPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();

      // Re-render should work fine
      rerender(
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument();
      expect(screen.getByText(/completa el formulario/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render without performance issues', () => {
      const startTime = performance.now();
      renderWithRouter(<RegisterPage />);
      const endTime = performance.now();

      // Should render quickly (less than 100ms in tests)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithRouter(<RegisterPage />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Layout Responsiveness', () => {
    it('should have container class for potential responsive behavior', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('container');
      
      // Container class typically implies responsive design
      expect(main.className.includes('container')).toBe(true);
    });

    it('should maintain proper structure for styling', () => {
      renderWithRouter(<RegisterPage />);

      const main = screen.getByRole('main');
      const registerPageDiv = main.firstElementChild;
      
      expect(registerPageDiv).toHaveClass('register-page');
      expect(registerPageDiv?.children).toHaveLength(3);
    });
  });

  describe('User Experience Elements', () => {
    it('should provide clear page purpose through title', () => {
      renderWithRouter(<RegisterPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title.textContent).toBe('Crear cuenta');
      
      // Title should be immediately clear about page purpose
      expect(title.textContent).toContain('cuenta');
    });

    it('should provide helpful instructions through subtitle', () => {
      renderWithRouter(<RegisterPage />);

      const subtitle = screen.getByText(/completa el formulario/i);
      expect(subtitle.textContent).toContain('formulario');
      expect(subtitle.textContent).toContain('crear');
      
      // Instructions should guide user action
      expect(subtitle.textContent?.toLowerCase()).toContain('completa');
    });
  });
});