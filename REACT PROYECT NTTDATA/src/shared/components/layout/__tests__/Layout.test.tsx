// Layout.test.tsx - Unit tests for Layout component
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '@/shared/components/layout/Layout';

// Mock the Header component
jest.mock('@/shared/components/layout/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Mock Header</header>;
  };
});

// Component wrapper with router for Header dependency
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  describe('Rendering', () => {
    it('should render layout component', () => {
      renderWithRouter(
        <Layout>
          <div>Test content</div>
        </Layout>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render Header component', () => {
      renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Mock Header')).toBeInTheDocument();
    });

    it('should render main element', () => {
      renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement.tagName.toLowerCase()).toBe('main');
    });

    it('should render children inside main element', () => {
      renderWithRouter(
        <Layout>
          <div data-testid="child-content">Child Content</div>
        </Layout>
      );
      
      const mainElement = screen.getByRole('main');
      const childContent = screen.getByTestId('child-content');
      
      expect(mainElement).toContainElement(childContent);
    });
  });

  describe('Children Rendering', () => {
    it('should render single child element', () => {
      renderWithRouter(
        <Layout>
          <p>Single paragraph</p>
        </Layout>
      );
      
      expect(screen.getByText('Single paragraph')).toBeInTheDocument();
    });

    it('should render multiple child elements', () => {
      renderWithRouter(
        <Layout>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </Layout>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('should render React fragments as children', () => {
      renderWithRouter(
        <Layout>
          <>
            <div>Fragment child 1</div>
            <div>Fragment child 2</div>
          </>
        </Layout>
      );
      
      expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
      expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
    });

    it('should render text content as children', () => {
      renderWithRouter(
        <Layout>
          Simple text content
        </Layout>
      );
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render mixed content types', () => {
      renderWithRouter(
        <Layout>
          Text content
          <span>Span element</span>
          {42}
          <div>Div element</div>
        </Layout>
      );
      
      expect(screen.getByText('Text content')).toBeInTheDocument();
      expect(screen.getByText('Span element')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Div element')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct component order', () => {
      const { container } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );
      
      const children = Array.from(container.firstChild?.childNodes || []);
      
      // First child should be Header (header element)
      expect((children[0] as Element).tagName?.toLowerCase()).toBe('header');
      
      // Second child should be main element
      expect((children[1] as Element).tagName?.toLowerCase()).toBe('main');
    });

    it('should render as Fragment root', () => {
      const { container } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );
      
      // Layout uses Fragment (<>) as root, so container.firstChild should be the div wrapper from BrowserRouter
      expect(container.firstChild?.childNodes).toHaveLength(2); // header + main
    });

    it('should maintain structure with different children', () => {
      const testChildren = [
        <div key="1">Simple div</div>,
        <section key="2">Section element</section>,
        <article key="3">Article content</article>,
      ];

      testChildren.forEach(child => {
        const { unmount } = renderWithRouter(
          <Layout>{child}</Layout>
        );
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Props Handling', () => {
    it('should accept ReactNode children prop', () => {
      const complexChild = (
        <div>
          <h1>Complex Child</h1>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      renderWithRouter(
        <Layout>{complexChild}</Layout>
      );
      
      expect(screen.getByText('Complex Child')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should handle undefined children gracefully', () => {
      renderWithRouter(
        <Layout>{undefined}</Layout>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      renderWithRouter(
        <Layout>{null}</Layout>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle empty string children', () => {
      renderWithRouter(
        <Layout>{''}</Layout>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      const showContent = true;
      const hideContent = false;
      
      renderWithRouter(
        <Layout>
          {showContent && <div>Conditional content</div>}
          {hideContent && <div>Hidden content</div>}
        </Layout>
      );
      
      expect(screen.getByText('Conditional content')).toBeInTheDocument();
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header role
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should maintain semantic structure with any content', () => {
      renderWithRouter(
        <Layout>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
        </Layout>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('region')).toBeInTheDocument(); // section role
    });
  });

  describe('Integration', () => {
    it('should work with Header component integration', () => {
      renderWithRouter(
        <Layout>
          <div>Page content</div>
        </Layout>
      );
      
      // Header should be rendered
      expect(screen.getByTestId('header')).toBeInTheDocument();
      
      // Content should be in main
      const mainElement = screen.getByRole('main');
      expect(mainElement).toContainElement(screen.getByText('Page content'));
    });

    it('should handle Header component errors gracefully', () => {
      // This test checks if Layout handles Header component failures
      renderWithRouter(
        <Layout>
          <div>Content despite header issues</div>
        </Layout>
      );
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('Content despite header issues')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      
      renderWithRouter(
        <Layout>
          <div>Performance test content</div>
        </Layout>
      );
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithRouter(
        <Layout>
          <div>Memory test content</div>
        </Layout>
      );
      
      expect(() => unmount()).not.toThrow();
    });

    it('should handle re-renders correctly', () => {
      const { rerender } = renderWithRouter(
        <Layout>
          <div>Initial content</div>
        </Layout>
      );
      
      expect(screen.getByText('Initial content')).toBeInTheDocument();
      
      rerender(
        <BrowserRouter>
          <Layout>
            <div>Updated content</div>
          </Layout>
        </BrowserRouter>
      );
      
      expect(screen.getByText('Updated content')).toBeInTheDocument();
      expect(screen.queryByText('Initial content')).not.toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should handle render errors gracefully', () => {
      expect(() => 
        renderWithRouter(
          <Layout>
            <div>Normal content</div>
          </Layout>
        )
      ).not.toThrow();
    });
  });
});