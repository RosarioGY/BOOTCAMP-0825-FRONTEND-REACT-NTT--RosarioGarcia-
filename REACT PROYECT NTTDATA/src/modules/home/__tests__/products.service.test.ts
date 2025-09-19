// products.service.test.ts - Tests for Products Service
import type { RawProduct } from '@/modules/home/types/products.types';

// Mock dependencies antes de importar nada más
jest.mock('@/shared/utils/fetchClient', () => ({
  apiFetch: jest.fn()
}));

jest.mock('@/shared/constants/api', () => ({
  API: {
    products: '/api/products',
    categories: '/api/categories'
  }
}));

describe('Products Service', () => {
  let getAllProducts: () => Promise<import('@/modules/home/types/products.types').Product[]>;
  let getAllCategories: () => Promise<string[]>;
  let mockedApiFetch: jest.MockedFunction<typeof import('@/shared/utils/fetchClient').apiFetch>;
  let API: typeof import('@/shared/constants/api').API;

  const mockRawProducts: RawProduct[] = [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
      images: []
    },
    {
      id: 2,
      title: 'iPhone X',
      description: 'SIM-Free, Model A19211 6.5-inch Super Retina',
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      stock: 34,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg',
      images: []
    }
  ];

  const mockCategories = ['smartphones', 'laptops', 'fragrances'];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Importamos las dependencias mockeadas
    const { apiFetch } = await import('@/shared/utils/fetchClient');
    const { API: ApiConstants } = await import('@/shared/constants/api');
    
    mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;
    API = ApiConstants;
    
    // Reimportamos dinámicamente para evitar problemas de cache
    const productsService = await import('@/modules/home/services/products.service');
    getAllProducts = productsService.getAllProducts;
    getAllCategories = productsService.getAllCategories;
  });

  describe('getAllProducts', () => {
    it('debe obtener productos de la API y mapearlos correctamente', async () => {
      const mockApiResponse = { products: mockRawProducts };
      mockedApiFetch.mockResolvedValueOnce(mockApiResponse);

      const result = await getAllProducts();

      expect(mockedApiFetch).toHaveBeenCalledWith(API.products);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        title: 'iPhone 9',
        description: 'An apple mobile which is nothing like apple',
        price: 549,
        rating: 4.69,
        stock: 94,
        brand: 'Apple',
        category: 'smartphones',
        thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'
      });
    });

    it('debe manejar respuesta vacía correctamente', async () => {
      const mockApiResponse = { products: [] };
      mockedApiFetch.mockResolvedValueOnce(mockApiResponse);

      const result = await getAllProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe propagar errores de la API', async () => {
      const mockError = new Error('API Error');
      mockedApiFetch.mockRejectedValueOnce(mockError);

      await expect(getAllProducts()).rejects.toThrow('API Error');
      expect(mockedApiFetch).toHaveBeenCalledWith(API.products);
    });

    it('debe mapear productos parciales correctamente', async () => {
      const incompleteProducts = [
        {
          id: 1,
          title: 'Producto Básico',
          price: 100,
          category: 'test'
        } as RawProduct
      ];

      const mockApiResponse = { products: incompleteProducts };
      mockedApiFetch.mockResolvedValueOnce(mockApiResponse);

      const result = await getAllProducts();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Producto Básico');
      expect(result[0].price).toBe(100);
    });
  });

  describe('getAllCategories', () => {
    it('debe obtener categorías de la API', async () => {
      mockedApiFetch.mockResolvedValueOnce(mockCategories);

      const result = await getAllCategories();

      expect(mockedApiFetch).toHaveBeenCalledWith(API.categories);
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(3);
      expect(result).toContain('smartphones');
      expect(result).toContain('laptops');
      expect(result).toContain('fragrances');
    });

    it('debe manejar respuesta vacía de categorías', async () => {
      mockedApiFetch.mockResolvedValueOnce([]);

      const result = await getAllCategories();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe propagar errores de la API de categorías', async () => {
      const mockError = new Error('Categories API Error');
      mockedApiFetch.mockRejectedValueOnce(mockError);

      await expect(getAllCategories()).rejects.toThrow('Categories API Error');
      expect(mockedApiFetch).toHaveBeenCalledWith(API.categories);
    });

    it('debe manejar categorías con strings vacíos', async () => {
      const mixedCategories = ['smartphones', 'laptops', ''];
      mockedApiFetch.mockResolvedValueOnce(mixedCategories);

      const result = await getAllCategories();
      expect(result).toEqual(mixedCategories);
      expect(result).toContain('');
    });
  });

  describe('casos edge del servicio', () => {
    it('debe manejar respuesta null/undefined en productos', async () => {
      mockedApiFetch.mockResolvedValueOnce(null);

      await expect(getAllProducts()).rejects.toThrow();
    });

    it('debe manejar respuesta sin estructura esperada en productos', async () => {
      mockedApiFetch.mockResolvedValueOnce({ data: [] }); // estructura incorrecta

      await expect(getAllProducts()).rejects.toThrow();
    });

    it('debe manejar respuesta null en categorías', async () => {
      mockedApiFetch.mockResolvedValueOnce(null);

      const result = await getAllCategories();
      
      // El servicio actualmente no valida null, solo devuelve lo que viene de la API
      expect(result).toBe(null);
    });

    it('debe validar que productos tenga estructura correcta', async () => {
      const invalidResponse = { wrongKey: mockRawProducts };
      mockedApiFetch.mockResolvedValueOnce(invalidResponse);

      await expect(getAllProducts()).rejects.toThrow();
    });
  });

  describe('integración de servicios', () => {
    it('debe poder llamar ambos servicios independientemente', async () => {
      const mockApiResponseProducts = { products: mockRawProducts };
      
      mockedApiFetch
        .mockResolvedValueOnce(mockApiResponseProducts)
        .mockResolvedValueOnce(mockCategories);

      const [productsResult, categoriesResult] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);

      expect(mockedApiFetch).toHaveBeenCalledTimes(2);
      expect(mockedApiFetch).toHaveBeenNthCalledWith(1, API.products);
      expect(mockedApiFetch).toHaveBeenNthCalledWith(2, API.categories);

      expect(productsResult).toHaveLength(2);
      expect(categoriesResult).toHaveLength(3);
    });

    it('debe manejar errores independientes en cada servicio', async () => {
      const mockError = new Error('Products API Error');
      
      mockedApiFetch
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockCategories);

      // Productos debe fallar
      await expect(getAllProducts()).rejects.toThrow('Products API Error');

      // Categorías debe funcionar independientemente
      const categoriesResult = await getAllCategories();
      expect(categoriesResult).toEqual(mockCategories);
    });
  });
});