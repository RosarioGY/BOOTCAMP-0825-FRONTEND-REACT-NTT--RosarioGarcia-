// CartProvider.test.tsx - Unit tests for CartProvider component
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { CartProvider } from '@/modules/cart/context/CartProvider';
import { useCart } from '@/modules/cart/hooks/useCart';

// Test component to access cart context
function TestComponent() {
  const { 
    items, 
    totalUnique, 
    totalQty, 
    totalPrice, 
    addOne, 
    inc, 
    dec, 
    remove, 
    clear, 
    qtyOf 
  } = useCart();

  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="total-unique">{totalUnique}</div>
      <div data-testid="total-qty">{totalQty}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="items">{JSON.stringify(items)}</div>
      <button
        onClick={() => addOne({ id: 1, title: 'Test Product', price: 10, stock: 5, thumbnail: 'test.jpg' })}
        data-testid="add-product-1"
      >
        Add Product 1
      </button>
      <button
        onClick={() => addOne({ id: 2, title: 'Test Product 2', price: 20, stock: 3, thumbnail: 'test2.jpg' })}
        data-testid="add-product-2"
      >
        Add Product 2
      </button>
      <button onClick={() => inc(1)} data-testid="inc-1">Inc Product 1</button>
      <button onClick={() => dec(1)} data-testid="dec-1">Dec Product 1</button>
      <button onClick={() => inc(2)} data-testid="inc-2">Inc Product 2</button>
      <button onClick={() => dec(2)} data-testid="dec-2">Dec Product 2</button>
      <button onClick={() => remove(1)} data-testid="remove-1">Remove Product 1</button>
      <button onClick={() => remove(2)} data-testid="remove-2">Remove Product 2</button>
      <button onClick={() => clear()} data-testid="clear">Clear Cart</button>
      <div data-testid="qty-of-1">{qtyOf(1)}</div>
      <div data-testid="qty-of-2">{qtyOf(2)}</div>
    </div>
  );
}

describe('CartProvider Component', () => {
  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
  };

  describe('Initial State', () => {
    it('should render with empty cart initially', () => {
      renderWithProvider();

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('0');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('items')).toHaveTextContent('[]');
    });

    it('should provide all required context functions', () => {
      renderWithProvider();

      // All buttons should be rendered (confirming all functions are available)
      expect(screen.getByTestId('add-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('inc-1')).toBeInTheDocument();
      expect(screen.getByTestId('dec-1')).toBeInTheDocument();
      expect(screen.getByTestId('remove-1')).toBeInTheDocument();
      expect(screen.getByTestId('clear')).toBeInTheDocument();
    });

    it('should return 0 for qtyOf non-existent products', () => {
      renderWithProvider();

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('0');
    });
  });

  describe('addOne Function', () => {
    it('should add new product to cart', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('1');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('10');
      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('1');
    });

    it('should increment quantity when adding existing product', () => {
      renderWithProvider();

      // Add product twice
      act(() => {
        screen.getByTestId('add-product-1').click();
      });
      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('1');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('20');
      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('2');
    });

    it('should handle multiple different products', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('2');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('30'); // 10 + 20
    });

    it('should respect stock limits when adding products', () => {
      renderWithProvider();

      // Add product to its stock limit (5)
      act(() => {
        for (let i = 0; i < 5; i++) {
          screen.getByTestId('add-product-1').click();
        }
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('5');

      // Try to add one more - should not exceed stock
      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('5'); // Should still be 5
      expect(screen.getByTestId('total-qty')).toHaveTextContent('5');
      expect(screen.getByTestId('total-price')).toHaveTextContent('50');
    });
  });

  describe('inc Function', () => {
    it('should increment quantity of existing product', () => {
      renderWithProvider();

      // Add product first
      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      // Then increment
      act(() => {
        screen.getByTestId('inc-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('2');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('20');
    });

    it('should not increment non-existent product', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('inc-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('0');
    });

    it('should respect stock limits when incrementing', () => {
      renderWithProvider();

      // Add product to stock limit
      act(() => {
        for (let i = 0; i < 5; i++) {
          screen.getByTestId('add-product-1').click();
        }
      });

      // Try to increment beyond stock
      act(() => {
        screen.getByTestId('inc-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('5'); // Should not exceed stock
    });
  });

  describe('dec Function', () => {
    it('should decrement quantity of existing product', () => {
      renderWithProvider();

      // Add product twice
      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-1').click();
      });

      // Decrement
      act(() => {
        screen.getByTestId('dec-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('1');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('10');
    });

    it('should remove product when decrementing to 0', () => {
      renderWithProvider();

      // Add product once
      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      // Decrement to remove
      act(() => {
        screen.getByTestId('dec-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('0');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    it('should not affect cart when decrementing non-existent product', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('dec-1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('0');
    });
  });

  describe('remove Function', () => {
    it('should remove specific product from cart', () => {
      renderWithProvider();

      // Add multiple products
      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
      });

      // Remove product 1
      act(() => {
        screen.getByTestId('remove-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('1');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('1');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('20');
    });

    it('should not affect cart when removing non-existent product', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('add-product-2').click();
      });

      act(() => {
        screen.getByTestId('remove-1').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('1');
    });
  });

  describe('clear Function', () => {
    it('should clear all items from cart', () => {
      renderWithProvider();

      // Add multiple products
      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
        screen.getByTestId('add-product-1').click();
      });

      // Clear cart
      act(() => {
        screen.getByTestId('clear').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-unique')).toHaveTextContent('0');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('0');
    });

    it('should not error when clearing empty cart', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('clear').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  describe('qtyOf Function', () => {
    it('should return correct quantity for existing products', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('2');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('1');
    });

    it('should return 0 for non-existent products', () => {
      renderWithProvider();

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('0');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('0');
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate totals correctly with multiple products', () => {
      renderWithProvider();

      // Add: 2x Product1 (price=10) + 3x Product2 (price=20)
      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
        screen.getByTestId('add-product-2').click();
        screen.getByTestId('add-product-2').click();
      });

      expect(screen.getByTestId('items-count')).toHaveTextContent('2'); // 2 unique products
      expect(screen.getByTestId('total-unique')).toHaveTextContent('2');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('5'); // 2 + 3
      expect(screen.getByTestId('total-price')).toHaveTextContent('80'); // (2*10) + (3*20) = 80
    });

    it('should recalculate totals when items are modified', () => {
      renderWithProvider();

      // Add products
      act(() => {
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('add-product-2').click();
        screen.getByTestId('add-product-2').click();
      });

      expect(screen.getByTestId('total-price')).toHaveTextContent('50'); // 10 + (2*20)

      // Remove one product 2
      act(() => {
        screen.getByTestId('dec-2').click();
      });

      expect(screen.getByTestId('total-price')).toHaveTextContent('30'); // 10 + 20
    });
  });

  describe('Context Integration', () => {
    it('should maintain state during component re-renders', () => {
      const { rerender } = renderWithProvider();

      act(() => {
        screen.getByTestId('add-product-1').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('1');

      // Re-render with same provider tree - this maintains state in the same provider instance
      rerender(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Since we're using the same provider instance, state should be maintained
      // If we want to test state reset, we need to unmount and remount completely
      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('1');
    });

    it('should handle rapid state updates correctly', () => {
      renderWithProvider();

      act(() => {
        // Rapid updates
        screen.getByTestId('add-product-1').click();
        screen.getByTestId('inc-1').click();
        screen.getByTestId('inc-1').click();
        screen.getByTestId('dec-1').click();
        screen.getByTestId('add-product-2').click();
      });

      expect(screen.getByTestId('qty-of-1')).toHaveTextContent('2');
      expect(screen.getByTestId('qty-of-2')).toHaveTextContent('1');
      expect(screen.getByTestId('total-qty')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent('40'); // (2*10) + (1*20)
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with 0 stock', () => {
      const NoStockTestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <button
              onClick={() => {
                cart.addOne({ id: 3, title: 'No Stock Product', price: 15, stock: 0, thumbnail: 'test.jpg' });
              }}
              data-testid="add-no-stock"
            >
              Add No Stock
            </button>
            <div data-testid="no-stock-qty">{cart.qtyOf(3)}</div>
            <div data-testid="items-count">{cart.items.length}</div>
          </div>
        );
      };

      render(
        <CartProvider>
          <NoStockTestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-no-stock').click();
      });

      // El producto con stock 0 se agrega con qty 1 inicialmente, pero no se puede incrementar
      expect(screen.getByTestId('no-stock-qty')).toHaveTextContent('1');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    });

    it('should handle products with price 0', () => {
      const FreeProductTestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <button
              onClick={() => {
                cart.addOne({ id: 4, title: 'Free Product', price: 0, stock: 10, thumbnail: 'test.jpg' });
              }}
              data-testid="add-free"
            >
              Add Free
            </button>
            <div data-testid="total-price">{cart.totalPrice}</div>
            <div data-testid="free-qty">{cart.qtyOf(4)}</div>
          </div>
        );
      };

      render(
        <CartProvider>
          <FreeProductTestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-free').click();
        screen.getByTestId('add-free').click();
      });

      expect(screen.getByTestId('free-qty')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0'); // Price should remain 0
    });
  });
});