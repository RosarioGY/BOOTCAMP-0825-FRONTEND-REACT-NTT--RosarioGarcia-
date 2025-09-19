// ProductCard.jest.test.tsx - Test unitario para ProductCard
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductCard from '@/modules/home/components/ProductCard';
import type { Product } from '@/modules/home/types/products.types';

// Mock de las utilidades de locale
jest.mock('@/shared/utils/locale', () => ({
  CATEGORY_ES: {
    'smartphones': 'Teléfonos',
    'laptops': 'Portátiles',
  },
  uiES: {
    addToCart: 'Agregar al carrito',
    stock: 'Stock',
  },
  formatPricePEN: jest.fn((price: number) => `S/ ${price.toFixed(2)}`),
  usdToPen: jest.fn((price: number) => price * 3.75),
  capitalize: jest.fn((text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()),
}));

// Import mocks para poder acceder a las funciones mockeadas
import * as localeUtils from '@/shared/utils/locale';

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'Latest iPhone model',
    price: 999,
    rating: 4.5,
    stock: 10,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://example.com/iphone.jpg',
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('debe renderizar correctamente', () => {
    test('debe mostrar toda la información del producto', () => {
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText(/Apple · Teléfonos/)).toBeInTheDocument();
      expect(screen.getByText('S/ 3746.25')).toBeInTheDocument(); // 999 * 3.75
      expect(screen.getByText(/Stock:\s*10/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument();
    });

    test('debe mostrar la imagen del producto con alt text correcto', () => {
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      const image = screen.getByRole('img', { name: 'iPhone 15 Pro' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/iphone.jpg');
      expect(image).toHaveAttribute('alt', 'iPhone 15 Pro');
    });

    test('debe usar categoría en español cuando está disponible', () => {
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText(/Teléfonos/)).toBeInTheDocument();
    });

    test('debe usar capitalize cuando la categoría no está en CATEGORY_ES', () => {
      const productWithUnknownCategory = {
        ...mockProduct,
        category: 'electronics',
      };

      render(<ProductCard product={productWithUnknownCategory} onAddToCart={mockOnAddToCart} />);

      expect(localeUtils.capitalize).toHaveBeenCalledWith('electronics');
    });
  });

  describe('interacciones del usuario', () => {
    test('debe llamar onAddToCart cuando se hace click en el botón', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      const addButton = screen.getByRole('button', { name: 'Agregar al carrito' });
      await user.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    test('debe permitir múltiples clicks en el botón agregar', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      const addButton = screen.getByRole('button', { name: 'Agregar al carrito' });
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledTimes(3);
    });
  });

  describe('formateo de precio', () => {
    test('debe convertir USD a PEN y formatear correctamente', () => {
      render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      expect(localeUtils.usdToPen).toHaveBeenCalledWith(999);
      expect(localeUtils.formatPricePEN).toHaveBeenCalledWith(3746.25); // 999 * 3.75
    });

    test('debe mostrar precio cero correctamente', () => {
      const freeProduct = { ...mockProduct, price: 0 };
      render(<ProductCard product={freeProduct} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText('S/ 0.00')).toBeInTheDocument();
    });
  });

  describe('manejo de diferentes stocks', () => {
    test('debe mostrar stock alto correctamente', () => {
      const highStockProduct = { ...mockProduct, stock: 999 };
      render(<ProductCard product={highStockProduct} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText('Stock: 999')).toBeInTheDocument();
    });

    test('debe mostrar stock cero correctamente', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText('Stock: 0')).toBeInTheDocument();
    });
  });

  describe('estructura HTML correcta', () => {
    test('debe usar el elemento article como contenedor principal', () => {
      const { container } = render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      const article = container.querySelector('article.product-card');
      expect(article).toBeInTheDocument();
    });

    test('debe tener la estructura de clases CSS esperada', () => {
      const { container } = render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

      expect(container.querySelector('.product-card')).toBeInTheDocument();
      expect(container.querySelector('.product-media')).toBeInTheDocument();
      expect(container.querySelector('.product-title')).toBeInTheDocument();
      expect(container.querySelector('.product-meta')).toBeInTheDocument();
      expect(container.querySelector('.product-bottom')).toBeInTheDocument();
      expect(container.querySelector('.product-price')).toBeInTheDocument();
      expect(container.querySelector('.add-to-cart')).toBeInTheDocument();
      expect(container.querySelector('.product-stock')).toBeInTheDocument();
    });
  });

  describe('manejo de datos faltantes', () => {
    test('debe manejar title vacío correctamente', () => {
      const productWithEmptyTitle = { ...mockProduct, title: '' };
      render(<ProductCard product={productWithEmptyTitle} onAddToCart={mockOnAddToCart} />);

      const titleElement = screen.queryByRole('heading', { level: 3 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('');
    });

    test('debe manejar brand vacío correctamente', () => {
      const productWithEmptyBrand = { ...mockProduct, brand: '' };
      render(<ProductCard product={productWithEmptyBrand} onAddToCart={mockOnAddToCart} />);

      expect(screen.getByText(/·\s*Teléfonos/)).toBeInTheDocument();
    });
  });
});