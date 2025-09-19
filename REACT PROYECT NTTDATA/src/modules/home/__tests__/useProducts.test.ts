// useProducts.test.ts - Tests for useProducts Hook
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts, useFilteredProducts } from '@/modules/home/hooks/useProducts';
import { getAllProducts, getAllCategories } from '@/modules/home/services/products.service';
import type { Product } from '@/modules/home/types/products.types';

// Mock the services
jest.mock('@/modules/home/services/products.service');

const mockedGetAllProducts = getAllProducts as jest.MockedFunction<typeof getAllProducts>;
const mockedGetAllCategories = getAllCategories as jest.MockedFunction<typeof getAllCategories>;

describe('useProducts Hook', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'
    },
    {
      id: 2,
      title: 'MacBook Pro',
      description: 'MacBook Pro 2021 with mini-LED display',
      price: 1749,
      rating: 4.57,
      stock: 83,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'https://i.dummyjson.com/data/products/6/thumbnail.png'
    }
  ];

  const mockCategories = ['smartphones', 'laptops', 'fragrances'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('estado inicial', () => {
    it('debe inicializar con loading true y arrays vacíos', () => {
      mockedGetAllProducts.mockImplementation(() => new Promise(() => {})); // Never resolves
      mockedGetAllCategories.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('carga exitosa', () => {
    it('debe cargar productos y categorías correctamente', async () => {
      mockedGetAllProducts.mockResolvedValue(mockProducts);
      mockedGetAllCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
    });

    it('debe llamar a ambos servicios en paralelo', async () => {
      mockedGetAllProducts.mockResolvedValue(mockProducts);
      mockedGetAllCategories.mockResolvedValue(mockCategories);

      renderHook(() => useProducts());

      await waitFor(() => {
        expect(mockedGetAllProducts).toHaveBeenCalledTimes(1);
        expect(mockedGetAllCategories).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('manejo de errores', () => {
    it('debe manejar error en getAllProducts', async () => {
      mockedGetAllProducts.mockRejectedValue(new Error('API Error'));
      mockedGetAllCategories.mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });

    it('debe manejar error en getAllCategories', async () => {
      mockedGetAllProducts.mockResolvedValue(mockProducts);
      mockedGetAllCategories.mockRejectedValue(new Error('Categories API Error'));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });

    it('debe manejar error en ambos servicios', async () => {
      mockedGetAllProducts.mockRejectedValue(new Error('Products Error'));
      mockedGetAllCategories.mockRejectedValue(new Error('Categories Error'));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Algo salió mal, inténtelo más tarde');
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });
  });

  describe('limpieza en unmount', () => {
    it('no debe actualizar estado si el componente se desmonta', async () => {
      // Mock que resuelve después de un tiempo
      mockedGetAllProducts.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
      );
      mockedGetAllCategories.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCategories), 100))
      );

      const { result, unmount } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);

      // Desmontar antes de que se resuelvan las promesas
      unmount();

      // Esperar a que las promesas se resuelvan
      await new Promise(resolve => setTimeout(resolve, 150));

      // El estado no debería haber cambiado después del unmount
      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });
  });
});

describe('useFilteredProducts Hook', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'
    },
    {
      id: 2,
      title: 'MacBook Pro',
      description: 'MacBook Pro 2021 with mini-LED display',
      price: 1749,
      rating: 4.57,
      stock: 83,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'https://i.dummyjson.com/data/products/6/thumbnail.png'
    },
    {
      id: 3,
      title: 'Samsung Galaxy S21',
      description: 'Samsung flagship smartphone',
      price: 799,
      rating: 4.5,
      stock: 120,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/3/thumbnail.jpg'
    }
  ];

  describe('filtrado por categoría', () => {
    it('debe devolver todos los productos cuando category es "Todos"', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '', 'Todos')
      );

      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(mockProducts);
    });

    it('debe filtrar por categoría smartphones', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '', 'smartphones')
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0].category).toBe('smartphones');
      expect(result.current[1].category).toBe('smartphones');
    });

    it('debe filtrar por categoría laptops', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '', 'laptops')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].category).toBe('laptops');
      expect(result.current[0].title).toBe('MacBook Pro');
    });

    it('debe devolver array vacío para categoría inexistente', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '', 'tablets')
      );

      expect(result.current).toHaveLength(0);
    });
  });

  describe('filtrado por término de búsqueda', () => {
    it('debe devolver todos los productos con término vacío', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '', 'Todos')
      );

      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(mockProducts);
    });

    it('debe devolver todos los productos con término menor a 3 caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'iP', 'Todos')
      );

      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(mockProducts);
    });

    it('debe filtrar por título con término de 3+ caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'iPhone', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 9');
    });

    it('debe ser case insensitive en la búsqueda', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'IPHONE', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 9');
    });

    it('debe filtrar por descripción', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'mini-LED', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('MacBook Pro');
    });

    it('debe filtrar por marca', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'Samsung', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('Samsung Galaxy S21');
    });

    it('debe devolver array vacío cuando no hay coincidencias', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'Nintendo', 'Todos')
      );

      expect(result.current).toHaveLength(0);
    });

    it('debe manejar términos con espacios extra', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, '  iPhone  ', 'Todos')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 9');
    });
  });

  describe('filtrado combinado (categoría + término)', () => {
    it('debe filtrar por categoría Y término de búsqueda', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'Apple', 'smartphones')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('iPhone 9');
      expect(result.current[0].category).toBe('smartphones');
    });

    it('debe aplicar categoría primero, luego término', () => {
      // Apple tiene productos en smartphones y laptops, pero buscamos solo en laptops
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'Apple', 'laptops')
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('MacBook Pro');
    });

    it('debe devolver vacío cuando categoría tiene productos pero término no coincide', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'Nintendo', 'smartphones')
      );

      expect(result.current).toHaveLength(0);
    });

    it('debe devolver vacío cuando término coincide pero no la categoría', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'iPhone', 'laptops')
      );

      expect(result.current).toHaveLength(0);
    });
  });

  describe('reactividad a cambios de parámetros', () => {
    it('debe recalcular cuando cambia el término de búsqueda', () => {
      let term = 'iPhone';
      const { result, rerender } = renderHook(
        ({ term }) => useFilteredProducts(mockProducts, term, 'Todos'),
        { initialProps: { term } }
      );

      expect(result.current).toHaveLength(1);

      // Cambiar término
      term = 'Samsung';
      rerender({ term });

      expect(result.current).toHaveLength(1);
      expect(result.current[0].title).toBe('Samsung Galaxy S21');
    });

    it('debe recalcular cuando cambia la categoría', () => {
      let category = 'smartphones';
      const { result, rerender } = renderHook(
        ({ category }) => useFilteredProducts(mockProducts, '', category),
        { initialProps: { category } }
      );

      expect(result.current).toHaveLength(2);

      // Cambiar categoría
      category = 'laptops';
      rerender({ category });

      expect(result.current).toHaveLength(1);
      expect(result.current[0].category).toBe('laptops');
    });

    it('debe recalcular cuando cambian los productos', () => {
      let products = mockProducts.slice(0, 2); // Solo primeros 2
      const { result, rerender } = renderHook(
        ({ products }) => useFilteredProducts(products, '', 'Todos'),
        { initialProps: { products } }
      );

      expect(result.current).toHaveLength(2);

      // Cambiar productos
      products = mockProducts; // Todos los productos
      rerender({ products });

      expect(result.current).toHaveLength(3);
    });
  });

  describe('casos edge', () => {
    it('debe manejar array de productos vacío', () => {
      const { result } = renderHook(() => 
        useFilteredProducts([], 'test', 'Todos')
      );

      expect(result.current).toHaveLength(0);
    });

    it('debe manejar productos sin propiedades de texto', () => {
      const productsWithoutText = [
        {
          id: 1,
          title: '' as string,
          description: '' as string,
          brand: '' as string,
          price: 100,
          rating: 5,
          stock: 10,
          category: 'test',
          thumbnail: 'test.jpg'
        }
      ];

      const { result } = renderHook(() => 
        useFilteredProducts(productsWithoutText, 'test', 'Todos')
      );

      expect(result.current).toHaveLength(0);
    });

    it('debe manejar propiedades de texto que no son strings', () => {
      // Simulamos productos con propiedades problemáticas usando Object.assign
      const productsWithNonStringText = [
        Object.assign({
          id: 1,
          title: 'test',
          description: 'test',
          brand: 'test',
          price: 100,
          rating: 5,
          stock: 10,
          category: 'test',
          thumbnail: 'test.jpg'
        }, {
          title: null,
          description: 123,
          brand: {}
        }) as Product
      ];

      const { result } = renderHook(() => 
        useFilteredProducts(productsWithNonStringText, 'test', 'Todos')
      );

      expect(result.current).toHaveLength(0);
    });

    it('debe manejar término de búsqueda exactamente de 3 caracteres', () => {
      const { result } = renderHook(() => 
        useFilteredProducts(mockProducts, 'App', 'Todos')
      );

      // Con 3 caracteres exactos, debería buscar
      expect(result.current).toHaveLength(2); // iPhone y MacBook (ambos de Apple)
    });
  });
});