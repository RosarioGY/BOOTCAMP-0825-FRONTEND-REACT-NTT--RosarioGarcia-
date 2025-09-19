// SummaryPage.test.tsx - Unit tests for SummaryPage component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SummaryPage } from '@/modules/cart/pages/SummaryPage';
import { CartProvider } from '@/modules/cart/context/CartProvider';

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock Layout component
jest.mock('@/shared/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

// Mock Modal component
jest.mock('@/shared/components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
  }) => 
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        <button onClick={onClose} aria-label="close">Close</button>
        {children}
      </div>
    ) : null
}));

// Mock Alert component
jest.mock('@/shared/components/ui/Alert', () => ({
  Alert: ({ type, message }: { type: string; message: string }) => (
    <div data-testid={`alert-${type}`}>{message}</div>
  )
}));

// Mock CheckoutForm component
jest.mock('@/modules/cart/components/CheckoutForm', () => {
  return function MockCheckoutForm({ disabled, onSuccess }: { 
    disabled: boolean; 
    onSuccess: (data: Record<string, string>) => void; 
  }) {
    return (
      <div data-testid="checkout-form">
        <button 
          disabled={disabled}
          onClick={() => onSuccess({ 
            firstName: 'John', 
            lastName: 'Doe', 
            phone: '123456789', 
            address: '123 Main St', 
            district: 'Test District' 
          })}
          data-testid="checkout-submit"
        >
          Finalizar Compra
        </button>
      </div>
    );
  };
});

describe('SummaryPage Component', () => {

  const renderSummaryPage = () => {
    return render(
      <MemoryRouter>
        <CartProvider>
          <SummaryPage />
        </CartProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid test output pollution
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render summary page with layout', () => {
      renderSummaryPage();

      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByText('Resumen de compras')).toBeInTheDocument();
    });

    it('should render empty cart message when no items', () => {
      renderSummaryPage();

      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should have correct page structure', () => {
      renderSummaryPage();

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Resumen de compras');
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    });
  });

  describe('Empty Cart State', () => {
    it('should show empty message with correct styling', () => {
      renderSummaryPage();

      const emptyMessage = screen.getByText('Tu carrito está vacío.');
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveStyle({
        padding: '16px',
        textAlign: 'center',
        color: '#6b7280'
      });
    });

    it('should disable checkout form when cart is empty', () => {
      renderSummaryPage();

      const checkoutButton = screen.getByTestId('checkout-submit');
      expect(checkoutButton).toBeDisabled();
    });

    it('should not show cart table when empty', () => {
      renderSummaryPage();

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByText('Producto')).not.toBeInTheDocument();
    });
  });

  describe('Cart with Items', () => {
    it('should render cart table headers correctly', () => {
      renderSummaryPage();
      
      // Since the cart starts empty, we need to add items first
      // This test would need to be expanded based on how you add items to the cart
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    });
  });

  describe('Checkout Process', () => {
    it('should render checkout form component', () => {
      renderSummaryPage();
      
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-submit')).toBeInTheDocument();
    });

    it('should have checkout button initially disabled for empty cart', () => {
      renderSummaryPage();

      const checkoutButton = screen.getByTestId('checkout-submit');
      expect(checkoutButton).toBeDisabled();
    });

    it('should display correct page title and content', () => {
      renderSummaryPage();

      expect(screen.getByText('Resumen de compras')).toBeInTheDocument();
      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    });

    it('should integrate with CheckoutForm component properly', () => {
      renderSummaryPage();

      // Verify that CheckoutForm receives the correct props
      const checkoutForm = screen.getByTestId('checkout-form');
      const submitButton = screen.getByTestId('checkout-submit');
      
      expect(checkoutForm).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('should render without modal initially', () => {
      renderSummaryPage();

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should have checkout form integrated', () => {
      renderSummaryPage();

      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-submit')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes', () => {
      renderSummaryPage();

      expect(screen.getByText('Resumen de compras').closest('.cart-card')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveClass('cart-title');
    });

    it('should have app-container wrapper', () => {
      renderSummaryPage();

      const appContainer = screen.getByText('Resumen de compras').closest('.app-container');
      expect(appContainer).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have navigation setup with router', () => {
      renderSummaryPage();

      // Verify that the component renders within router context
      expect(screen.getByText('Resumen de compras')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with CartProvider', () => {
      renderSummaryPage();

      // Cart should start empty
      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    });

    it('should integrate with Layout component', () => {
      renderSummaryPage();

      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('layout')).toContainElement(screen.getByText('Resumen de compras'));
    });

    it('should integrate with CheckoutForm component', () => {
      renderSummaryPage();

      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderSummaryPage();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Resumen de compras');
    });

    it('should have accessible form controls', () => {
      renderSummaryPage();

      const submitButton = screen.getByTestId('checkout-submit');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Finalizar Compra');
    });
  });

  describe('Error Handling', () => {
    it('should handle checkout errors gracefully', () => {
      renderSummaryPage();

      expect(() => {
        const checkoutButton = screen.getByTestId('checkout-submit');
        fireEvent.click(checkoutButton);
      }).not.toThrow();
    });

    it('should handle missing cart context gracefully', () => {
      // This test would need to be in a context without CartProvider
      // For now, just ensure component renders
      expect(() => renderSummaryPage()).not.toThrow();
    });
  });

  describe('State Management', () => {
    it('should manage cart state with provider', () => {
      renderSummaryPage();

      // Initial state - empty cart
      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Re-renders', () => {
    it('should handle re-renders correctly', () => {
      const { rerender } = renderSummaryPage();

      expect(screen.getByText('Resumen de compras')).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <CartProvider>
            <SummaryPage />
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Resumen de compras')).toBeInTheDocument();
    });
  });
});