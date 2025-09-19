import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartTable from '../components/CartTable';
import type { CartItem } from '../types/cart.types';

// Mock del componente QuantityControl
jest.mock('../components/QuantityControl', () => {
  return function MockQuantityControl({ 
    qty, 
    onInc, 
    onDec, 
    disabledInc 
  }: { 
    qty: number; 
    onInc: () => void; 
    onDec: () => void; 
    disabledInc: boolean; 
  }) {
    return (
      <div data-testid={`quantity-control-${qty}`}>
        <button 
          onClick={onDec} 
          data-testid="dec-button"
        >
          -
        </button>
        <span data-testid="quantity">{qty}</span>
        <button 
          onClick={onInc} 
          data-testid="inc-button"
          disabled={disabledInc}
        >
          +
        </button>
      </div>
    );
  };
});

// Mock de la función formatPricePEN
jest.mock('@/shared/utils/locale', () => ({
  formatPricePEN: jest.fn((price: number) => `S/ ${price.toFixed(2)}`)
}));

describe('CartTable Component', () => {
  const mockOnInc = jest.fn();
  const mockOnDec = jest.fn();
  const mockOnRemove = jest.fn();

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      title: 'iPhone 15',
      price: 999.99,
      thumbnail: 'https://example.com/iphone.jpg',
      qty: 2,
      stock: 10
    },
    {
      id: 2,
      title: 'Samsung Galaxy',
      price: 799.50,
      thumbnail: 'https://example.com/samsung.jpg',
      qty: 1,
      stock: 5
    }
  ];

  const defaultProps = {
    items: mockCartItems,
    onInc: mockOnInc,
    onDec: mockOnDec,
    onRemove: mockOnRemove
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderización básica', () => {
    test('debe renderizar la tabla con headers correctos', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByText('Producto')).toBeInTheDocument();
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Precio')).toBeInTheDocument();
      expect(screen.getByText('Cantidad')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });

    test('debe renderizar todos los items del carrito', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    });

    test('debe mostrar las imágenes de los productos', () => {
      render(<CartTable {...defaultProps} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      
      expect(images[0]).toHaveAttribute('src', 'https://example.com/iphone.jpg');
      expect(images[0]).toHaveAttribute('alt', 'iPhone 15');
      
      expect(images[1]).toHaveAttribute('src', 'https://example.com/samsung.jpg');
      expect(images[1]).toHaveAttribute('alt', 'Samsung Galaxy');
    });

    test('debe mostrar los precios formateados', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByText('S/ 999.99')).toBeInTheDocument();
      expect(screen.getByText('S/ 799.50')).toBeInTheDocument();
    });
  });

  describe('Carrito vacío', () => {
    test('debe mostrar mensaje cuando el carrito está vacío', () => {
      render(<CartTable {...defaultProps} items={[]} />);

      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('QuantityControl integration', () => {
    test('debe renderizar QuantityControl para cada item', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByTestId('quantity-control-2')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-control-1')).toBeInTheDocument();
    });

    test('debe mostrar el stock disponible para cada item', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByText('Stock: 10')).toBeInTheDocument();
      expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    });

    test('debe llamar onInc cuando se hace clic en incrementar', () => {
      render(<CartTable {...defaultProps} />);

      const incButtons = screen.getAllByTestId('inc-button');
      fireEvent.click(incButtons[0]);

      expect(mockOnInc).toHaveBeenCalledWith(1);
      expect(mockOnInc).toHaveBeenCalledTimes(1);
    });

    test('debe llamar onDec cuando se hace clic en decrementar', () => {
      render(<CartTable {...defaultProps} />);

      const decButtons = screen.getAllByTestId('dec-button');
      fireEvent.click(decButtons[1]);

      expect(mockOnDec).toHaveBeenCalledWith(2);
      expect(mockOnDec).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acciones de eliminación', () => {
    test('debe renderizar botón eliminar para cada item', () => {
      render(<CartTable {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Eliminar');
      expect(deleteButtons).toHaveLength(2);
    });

    test('debe llamar onRemove con el ID correcto', () => {
      render(<CartTable {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Eliminar');
      fireEvent.click(deleteButtons[0]);

      expect(mockOnRemove).toHaveBeenCalledWith(1);
      expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });

    test('debe llamar onRemove para diferentes items', () => {
      render(<CartTable {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Eliminar');
      
      fireEvent.click(deleteButtons[0]);
      expect(mockOnRemove).toHaveBeenCalledWith(1);
      
      fireEvent.click(deleteButtons[1]);
      expect(mockOnRemove).toHaveBeenCalledWith(2);
      
      expect(mockOnRemove).toHaveBeenCalledTimes(2);
    });
  });

  describe('Estilos y estructura', () => {
    test('debe aplicar estilos correctos a la tabla', () => {
      render(<CartTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toHaveStyle({
        width: '100%',
        borderCollapse: 'collapse'
      });
    });

    test('debe aplicar estilos a las imágenes', () => {
      render(<CartTable {...defaultProps} />);

      const images = screen.getAllByRole('img');
      images.forEach(image => {
        expect(image).toHaveStyle({
          width: '72px',
          height: '48px',
          objectFit: 'cover',
          borderRadius: '8px'
        });
      });
    });

    test('debe usar className col-price para las celdas de precio', () => {
      render(<CartTable {...defaultProps} />);

      const priceCells = document.querySelectorAll('.col-price');
      expect(priceCells).toHaveLength(2);
    });
  });

  describe('Props y comportamiento', () => {
    test('debe manejar items con stock límite', () => {
      const itemsWithLimitedStock: CartItem[] = [
        {
          id: 1,
          title: 'iPhone 15',
          price: 999.99,
          thumbnail: 'https://example.com/iphone.jpg',
          qty: 10,
          stock: 10
        }
      ];

      render(<CartTable {...defaultProps} items={itemsWithLimitedStock} />);

      // El botón de incremento debe estar deshabilitado
      const incButton = screen.getByTestId('inc-button');
      expect(incButton).toBeDisabled();
    });

    test('debe manejar correctamente múltiples acciones', () => {
      render(<CartTable {...defaultProps} />);

      // Incrementar primer item
      const incButtons = screen.getAllByTestId('inc-button');
      fireEvent.click(incButtons[0]);

      // Decrementar segundo item
      const decButtons = screen.getAllByTestId('dec-button');
      fireEvent.click(decButtons[1]);

      // Eliminar primer item
      const deleteButtons = screen.getAllByText('Eliminar');
      fireEvent.click(deleteButtons[0]);

      expect(mockOnInc).toHaveBeenCalledWith(1);
      expect(mockOnDec).toHaveBeenCalledWith(2);
      expect(mockOnRemove).toHaveBeenCalledWith(1);
    });
  });

  describe('Casos edge', () => {
    test('debe manejar item con cantidad 0', () => {
      const itemsWithZeroQty: CartItem[] = [
        {
          id: 1,
          title: 'Test Product',
          price: 100,
          thumbnail: 'https://example.com/test.jpg',
          qty: 0,
          stock: 5
        }
      ];

      render(<CartTable {...defaultProps} items={itemsWithZeroQty} />);

      expect(screen.getByTestId('quantity-control-0')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    test('debe manejar precio 0', () => {
      const itemsWithZeroPrice: CartItem[] = [
        {
          id: 1,
          title: 'Free Product',
          price: 0,
          thumbnail: 'https://example.com/free.jpg',
          qty: 1,
          stock: 1
        }
      ];

      render(<CartTable {...defaultProps} items={itemsWithZeroPrice} />);

      expect(screen.getByText('S/ 0.00')).toBeInTheDocument();
    });

    test('debe manejar URLs de imagen largas', () => {
      const itemsWithLongUrl: CartItem[] = [
        {
          id: 1,
          title: 'Product with Long URL',
          price: 100,
          thumbnail: 'https://very-long-domain-name-for-testing-purposes.example.com/path/to/very/long/image/file/name/that/might/cause/issues.jpg',
          qty: 1,
          stock: 1
        }
      ];

      expect(() => {
        render(<CartTable {...defaultProps} items={itemsWithLongUrl} />);
      }).not.toThrow();
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener alt text descriptivo en las imágenes', () => {
      render(<CartTable {...defaultProps} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'iPhone 15');
      expect(images[1]).toHaveAttribute('alt', 'Samsung Galaxy');
    });

    test('debe ser navegable por teclado', () => {
      render(<CartTable {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Eliminar');
      deleteButtons.forEach(button => {
        expect(button).toBeInstanceOf(HTMLButtonElement);
      });
    });

    test('debe mantener estructura semántica de tabla', () => {
      render(<CartTable {...defaultProps} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Hay múltiples rowgroups (thead y tbody)
      const rowgroups = screen.getAllByRole('rowgroup');
      expect(rowgroups).toHaveLength(2); // thead y tbody
      
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(2); // header + data rows
    });
  });
});