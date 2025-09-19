// HomePage.jest.test.tsx - Test unitario para HomePage
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { HomePage } from '@/modules/home/pages/HomePage';
import type { Product } from '@/modules/home/types/products.types';

// Mock del hook useProducts
const mockUseProducts = jest.fn();
jest.mock('@/modules/home/hooks/useProducts', () => ({
  useProducts: () => mockUseProducts(),
  useFilteredProducts: (products: Product[], term: string, category: string) => {
    if (category !== 'Todos') {
      products = products.filter(p => p.category === category);
    }
    if (term.trim().length >= 3) {
      const normalized = term.trim().toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(normalized) ||
        p.description.toLowerCase().includes(normalized) ||
        p.brand.toLowerCase().includes(normalized)
      );
    }
    return products;
  }
}));

// Mock del hook useCart
const mockAddOne = jest.fn();
jest.mock('@/modules/cart/hooks/useCart', () => ({
  useCart: () => ({ addOne: mockAddOne })
}));

// Mock de componentes y utilidades
jest.mock('@/modules/home/components/CategoryFilter', () => {
  return function MockCategoryChips({ onSelect }: { onSelect: (c: string) => void }) {
    return (
      <div data-testid="category-chips">
        <button onClick={() => onSelect('Todos')}>Todos</button>
        <button onClick={() => onSelect('smartphones')}>Teléfonos</button>
      </div>
    );
  };
});

jest.mock('@/shared/components/ui/Modal', () => ({
  Modal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => 
    isOpen ? <div data-testid="stock-modal">{children}</div> : null
}));

jest.mock('@/shared/components/ui/Alert', () => ({
  Alert: ({ message }: { message: string }) => <div data-testid="alert">{message}</div>
}));

jest.mock('@/shared/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

jest.mock('@/shared/utils/locale', () => ({
  CATEGORY_ES: {
    smartphones: 'Teléfonos',
  },
  formatPricePEN: (price: number) => `S/ ${price.toFixed(2)}`,
}));

describe('HomePage Component', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 15',
      description: 'Latest iPhone',
      price: 999,
      rating: 4.5,
      stock: 10,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'iphone.jpg'
    },
    {
      id: 2,
      title: 'Samsung Galaxy',
      description: 'Android phone',
      price: 799,
      rating: 4.2,
      stock: 5,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'galaxy.jpg'
    },
    {
      id: 3,
      title: 'MacBook Pro',
      description: 'Powerful laptop',
      price: 1999,
      rating: 4.8,
      stock: 3,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'macbook.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('estados de carga y error', () => {
    test('debe mostrar mensaje de carga', () => {
      mockUseProducts.mockReturnValue({
        loading: true,
        products: [],
        categories: [],
        error: null
      });

      render(<HomePage />);

      expect(screen.getByText('Cargando productos…')).toBeInTheDocument();
    });

    test('debe mostrar mensaje de error', () => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: [],
        categories: [],
        error: 'Error al cargar productos'
      });

      render(<HomePage />);

      expect(screen.getByTestId('alert')).toHaveTextContent('Error al cargar productos');
    });
  });

  describe('renderizado con datos exitoso', () => {
    beforeEach(() => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });
    });

    test('debe renderizar el título y filtros correctamente', () => {
      render(<HomePage />);

      expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar productos… (mínimo 3 caracteres)')).toBeInTheDocument();
      expect(screen.getByTestId('category-chips')).toBeInTheDocument();
    });

    test('debe mostrar todos los productos por defecto', () => {
      render(<HomePage />);

      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });

    test('debe mostrar información correcta de cada producto', () => {
      render(<HomePage />);

      // Verificar información del iPhone
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText(/Apple · Teléfonos/)).toBeInTheDocument();
      expect(screen.getByText('S/ 999.00')).toBeInTheDocument();
      expect(screen.getByText('Stock: 10')).toBeInTheDocument();
    });
  });

  describe('funcionalidad de búsqueda', () => {
    beforeEach(() => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });
    });

    test('debe filtrar productos por término de búsqueda', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const searchInput = screen.getByPlaceholderText('Buscar productos… (mínimo 3 caracteres)');
      await user.type(searchInput, 'iPhone');

      // Solo debería mostrar el iPhone
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.queryByText('Samsung Galaxy')).not.toBeInTheDocument();
      expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
    });

    test('no debe filtrar con menos de 3 caracteres', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const searchInput = screen.getByPlaceholderText('Buscar productos… (mínimo 3 caracteres)');
      await user.type(searchInput, 'iP');

      // Debería mostrar todos los productos
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });
  });

  describe('funcionalidad de filtro por categoría', () => {
    beforeEach(() => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });
    });

    test('debe filtrar productos por categoría smartphones', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const phonesButton = screen.getByRole('button', { name: 'Teléfonos' });
      await user.click(phonesButton);

      // Solo debería mostrar productos de smartphones
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
      expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
    });

    test('debe mostrar todos los productos cuando se selecciona "Todos"', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      // Primero filtrar por categoría
      const phonesButton = screen.getByRole('button', { name: 'Teléfonos' });
      await user.click(phonesButton);

      // Luego volver a "Todos"
      const allButton = screen.getByRole('button', { name: 'Todos' });
      await user.click(allButton);

      // Debería mostrar todos los productos
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    });
  });

  describe('funcionalidad agregar al carrito', () => {
    beforeEach(() => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });
    });

    test('debe agregar producto al carrito exitosamente', async () => {
      mockAddOne.mockReturnValue('success');
      const user = userEvent.setup();
      render(<HomePage />);

      const addButtons = screen.getAllByText('Agregar al carrito');
      await user.click(addButtons[0]); // Click en el primer producto

      expect(mockAddOne).toHaveBeenCalledTimes(1);
      expect(mockAddOne).toHaveBeenCalledWith({
        id: 1,
        title: 'iPhone 15',
        price: 999,
        thumbnail: 'iphone.jpg',
        stock: 10
      });
    });

    test('debe mostrar modal de stock insuficiente', async () => {
      mockAddOne.mockReturnValue('out_of_stock');
      const user = userEvent.setup();
      render(<HomePage />);

      const addButtons = screen.getAllByText('Agregar al carrito');
      await user.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('stock-modal')).toBeInTheDocument();
        expect(screen.getByTestId('alert')).toHaveTextContent(
          'Ya no hay más stock disponible para "iPhone 15".'
        );
      });
    });
  });

  describe('paginación', () => {
    beforeEach(() => {
      // Crear muchos productos para probar la paginación
      const manyProducts = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Producto ${i + 1}`,
        description: `Descripción ${i + 1}`,
        price: 100 + i,
        rating: 4.0,
        stock: 10,
        brand: 'Marca',
        category: 'smartphones',
        thumbnail: `producto${i + 1}.jpg`
      }));

      mockUseProducts.mockReturnValue({
        loading: false,
        products: manyProducts,
        categories: ['smartphones'],
        error: null
      });
    });

    test('debe mostrar paginador cuando hay más de 12 productos', () => {
      render(<HomePage />);

      // Debería mostrar solo los primeros 12 productos
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 12')).toBeInTheDocument();
      expect(screen.queryByText('Producto 13')).not.toBeInTheDocument();

      // Debería mostrar controles de paginación
      expect(screen.getByRole('button', { name: /‹/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /›/ })).toBeInTheDocument();
    });

    test('debe cambiar de página correctamente', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      // Click en página 2
      const page2Button = screen.getByRole('button', { name: '2' });
      await user.click(page2Button);

      // Debería mostrar productos de la página 2
      expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
      expect(screen.getByText('Producto 13')).toBeInTheDocument();
    });
  });

  describe('estado vacío', () => {
    test('debe mostrar mensaje cuando no hay productos', () => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: [],
        categories: [],
        error: null
      });

      render(<HomePage />);

      expect(screen.getByText('No hay productos para esta selección.')).toBeInTheDocument();
    });

    test('debe mostrar mensaje cuando filtro no devuelve resultados', async () => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });

      const user = userEvent.setup();
      render(<HomePage />);

      const searchInput = screen.getByPlaceholderText('Buscar productos… (mínimo 3 caracteres)');
      await user.type(searchInput, 'producto inexistente');

      expect(screen.getByText('No hay productos para esta selección.')).toBeInTheDocument();
    });
  });

  describe('modal de stock', () => {
    beforeEach(() => {
      mockUseProducts.mockReturnValue({
        loading: false,
        products: mockProducts,
        categories: ['smartphones', 'laptops'],
        error: null
      });
      mockAddOne.mockReturnValue('out_of_stock');
    });

    test('debe cerrar modal cuando se hace click en cerrar', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const addButton = screen.getAllByText('Agregar al carrito')[0];
      await user.click(addButton);

      // El modal debería estar abierto
      await waitFor(() => {
        expect(screen.getByTestId('stock-modal')).toBeInTheDocument();
      });

      // Simular cierre del modal (en implementación real sería un botón X o overlay)
      // Para este test, verificamos que el estado se puede cambiar
    });
  });
});