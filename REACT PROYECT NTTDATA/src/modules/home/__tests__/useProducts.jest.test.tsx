// useProducts.jest.test.tsx - Test unitario para useProducts hooks
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts, useFilteredProducts } from '@/modules/home/hooks/useProducts';
import type { Product } from '@/modules/home/types/products.types';

// Mock del servicio de productos
const mockGetAllProducts = jest.fn();
const mockGetAllCategories = jest.fn();

jest.mock('@/modules/home/services/products.service', () => ({
  getAllProducts: () => mockGetAllProducts(),
  getAllCategories: () => mockGetAllCategories(),
}));

describe('useProducts Hook', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 15',
      description: 'Latest iPhone model',
      price: 999,
      rating: 4.5,
      stock: 10,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'iphone.jpg'
    },
    {
      id: 2,
      title: 'MacBook Pro',
      description: 'Powerful laptop for professionals',
      price: 1999,
      rating: 4.8,
      stock: 5,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'macbook.jpg'
    }
  ];

  const mockCategories = ['smartphones', 'laptops', 'tablets'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('estado inicial', () => {
    test('debe inicializar con loading true y arrays vacíos', () => {
      // Mock que nunca resuelve para probar estado inicial
      mockGetAllProducts.mockReturnValue(new Promise(() => {}));
      mockGetAllCategories.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('carga exitosa', () => {
    test('debe cargar productos y categorías correctamente', async () => {
      mockGetAllProducts.mockResolvedValue(mockProducts);
      mockGetAllCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
    });

    test('debe llamar a ambos servicios en paralelo', async () => {
      mockGetAllProducts.mockResolvedValue(mockProducts);
      mockGetAllCategories.mockResolvedValue(mockCategories);

      renderHook(() => useProducts());

      await waitFor(() => {
        expect(mockGetAllProducts).toHaveBeenCalledTimes(1);
        expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('manejo de errores', () => {
    test('debe manejar error en getAllProducts', async () => {
      mockGetAllProducts.mockRejectedValue(new Error('Network error'));
      mockGetAllCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });

    test('debe manejar error en getAllCategories', async () => {
      mockGetAllProducts.mockResolvedValue(mockProducts);
      mockGetAllCategories.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
    });

    test('debe manejar error en ambos servicios', async () => {
      mockGetAllProducts.mockRejectedValue(new Error('Products error'));
      mockGetAllCategories.mockRejectedValue(new Error('Categories error'));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
    });
  });

  describe('limpieza en unmount', () => {
    test('no debe actualizar estado si el componente se desmonta', async () => {
      let resolveProducts: (value: Product[]) => void;
      const productsPromise = new Promise<Product[]>((resolve) => {
        resolveProducts = resolve;
      });

      mockGetAllProducts.mockReturnValue(productsPromise);
      mockGetAllCategories.mockResolvedValue(mockCategories);

      const { result, unmount } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);

      // Desmontar antes de que resuelva la promesa
      unmount();

      // Resolver la promesa después del unmount
      resolveProducts!(mockProducts);

      // Esperar un poco para asegurar que no hay actualizaciones
      await new Promise(resolve => setTimeout(resolve, 10));

      // El estado no debería haber cambiado después del unmount
      expect(result.current.loading).toBe(true);
    });
  });
});

describe('useFilteredProducts Hook', () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      price: 999,
      rating: 4.5,
      stock: 10,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'iphone.jpg'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24',
      description: 'Android smartphone with great camera',
      price: 899,
      rating: 4.3,
      stock: 8,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'galaxy.jpg'
    },
    {
      id: 3,
      title: 'MacBook Pro M3',
      description: 'Professional laptop for developers',
      price: 1999,
      rating: 4.8,
      stock: 5,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'macbook.jpg'
    },
    {
      id: 4,
      title: 'Dell XPS 13',
      description: 'Ultrabook with great performance',
      price: 1299,
      rating: 4.4,
      stock: 3,
      brand: 'Dell',
      category: 'laptops',
      thumbnail: 'dell.jpg'
    }
  ];

  describe('filtrado por categoría', () => {
    test('debe devolver todos los productos cuando category es "Todos"', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '', 'Todos')
      );

      expect(result.current).toEqual(sampleProducts);
    });

    test('debe filtrar por categoría smartphones', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '', 'smartphones')
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0].title).toBe('iPhone 15 Pro');
      expect(result.current[1].title).toBe('Samsung Galaxy S24');
    });

    test('debe filtrar por categoría laptops', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '', 'laptops')
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0].title).toBe('MacBook Pro M3');
      expect(result.current[1].title).toBe('Dell XPS 13');
    });

    test('debe devolver array vacío para categoría inexistente', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '', 'tablets')
      );

      expect(result.current).toEqual([]);
    });
  });

  describe('filtrado por término de búsqueda', () => {
    test('debe devolver todos los productos con término vacío', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '', 'Todos')
      );

      expect(result.current).toEqual(sampleProducts);
    });

    test('debe devolver todos los productos con término menor a 3 caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'iP', 'Todos')
      );

      expect(result.current).toEqual(sampleProducts);
    });

    test('debe filtrar por título con término de 3+ caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'iPhone', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 15 Pro');
    });

    test('debe ser case insensitive en la búsqueda', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'IPHONE', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 15 Pro');
    });

    test('debe filtrar por descripción', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'professional', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('MacBook Pro M3');
    });

    test('debe filtrar por marca', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Apple', 'Todos')
      );

      expect(result.current).toHaveLength(2);
      expect(result.current.every(p => p.brand === 'Apple')).toBe(true);
    });

    test('debe devolver array vacío cuando no hay coincidencias', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Nintendo', 'Todos')
      );

      expect(result.current).toEqual([]);
    });

    test('debe manejar términos con espacios extra', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, '  iPhone  ', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 15 Pro');
    });
  });

  describe('filtrado combinado (categoría + término)', () => {
    test('debe filtrar por categoría Y término de búsqueda', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Apple', 'smartphones')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 15 Pro');
    });

    test('debe aplicar categoría primero, luego término', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Pro', 'laptops')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('MacBook Pro M3');
    });

    test('debe devolver vacío cuando categoría tiene productos pero término no coincide', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Nintendo', 'smartphones')
      );

      expect(result.current).toEqual([]);
    });

    test('debe devolver vacío cuando término coincide pero no la categoría', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'MacBook', 'smartphones')
      );

      expect(result.current).toEqual([]);
    });
  });

  describe('reactividad a cambios de parámetros', () => {
    test('debe recalcular cuando cambia el término de búsqueda', () => {
      const { result, rerender } = renderHook(
        ({ term }) => useFilteredProducts(sampleProducts, term, 'Todos'),
        { initialProps: { term: 'iPhone' } }
      );

      expect(result.current).toHaveLength(1);

      rerender({ term: 'Samsung' });
      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('Samsung Galaxy S24');
    });

    test('debe recalcular cuando cambia la categoría', () => {
      const { result, rerender } = renderHook(
        ({ category }) => useFilteredProducts(sampleProducts, 'Pro', category),
        { initialProps: { category: 'Todos' } }
      );

      expect(result.current).toHaveLength(2); // iPhone 15 Pro y MacBook Pro M3

      rerender({ category: 'laptops' });
      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('MacBook Pro M3');
    });

    test('debe recalcular cuando cambian los productos', () => {
      const initialProducts = sampleProducts.slice(0, 2);
      const { result, rerender } = renderHook(
        ({ products }) => useFilteredProducts(products, 'Apple', 'Todos'),
        { initialProps: { products: initialProducts } }
      );

      expect(result.current).toHaveLength(1); // Solo iPhone

      rerender({ products: sampleProducts });
      expect(result.current).toHaveLength(2); // iPhone y MacBook
    });
  });

  describe('casos edge', () => {
    test('debe manejar array de productos vacío', () => {
      const { result } = renderHook(() => 
        useFilteredProducts([], 'test', 'Todos')
      );

      expect(result.current).toEqual([]);
    });

    test('debe manejar productos sin propiedades de texto', () => {
      const productsWithNulls = [
        {
          ...sampleProducts[0],
          title: undefined,
          description: undefined,
          brand: undefined,
        } as unknown as Product
      ];

      const { result } = renderHook(() => 
        useFilteredProducts(productsWithNulls, 'test', 'Todos')
      );

      expect(result.current).toEqual([]);
    });

    test('debe manejar propiedades de texto que no son strings', () => {
      const productsWithNumbers = [
        {
          ...sampleProducts[0],
          title: 123,
          description: null,
          brand: {},
        } as unknown as Product
      ];

      const { result } = renderHook(() => 
        useFilteredProducts(productsWithNumbers, 'test', 'Todos')
      );

      expect(result.current).toEqual([]);
    });

    test('debe manejar término de búsqueda exactamente de 3 caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(sampleProducts, 'Pro', 'Todos')
      );

      expect(result.current).toHaveLength(2);
    });
  });
});