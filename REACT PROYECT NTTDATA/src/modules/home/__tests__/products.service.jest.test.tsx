// products.service.jest.test.tsx - Test realista para products.service con cache
import { getAllProducts, getAllCategories } from '@/modules/home/services/products.service';

// Mock del fetchClient
jest.mock('@/shared/utils/fetchClient', () => ({
  apiFetch: jest.fn()
}));

// Mock del mapper  
jest.mock('@/modules/home/mappers/products.mappers', () => ({
  mapProduct: jest.fn()
}));

// Mock de las constantes
jest.mock('@/shared/constants/api', () => ({
  API: {
    products: '/products',
    categories: '/products/categories'
  }
}));

import { apiFetch } from '@/shared/utils/fetchClient';
import { mapProduct } from '@/modules/home/mappers/products.mappers';

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;
const mockMapProduct = mapProduct as jest.MockedFunction<typeof mapProduct>;

describe('Products Service', () => {
  // Como el service tiene cache interno, vamos a hacer tests más realistas
  // que trabajen con el comportamiento existente del cache
  
  describe('getAllProducts', () => {
    test('debe obtener productos de la API y mapearlos', async () => {
      const mockRawProducts = [
        { id: 1, title: 'iPhone', price: 999, brand: 'Apple', category: 'smartphones' },
        { id: 2, title: 'MacBook', price: 1999, brand: 'Apple', category: 'laptops' }
      ];

      mockApiFetch.mockResolvedValue({ products: mockRawProducts });
      mockMapProduct.mockImplementation((product) => product as unknown as ReturnType<typeof mapProduct>);

      const result = await getAllProducts();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('iPhone');
      expect(result[1].title).toBe('MacBook');
    });

    test('debe usar cache en llamadas subsecuentes', async () => {
      // Este test aprovecha el cache del test anterior
      const result1 = await getAllProducts();
      const result2 = await getAllProducts();

      // Debe devolver los mismos datos sin hacer nueva llamada a API
      expect(result1).toBe(result2);
      expect(result1).toHaveLength(2);
    });
  });

  describe('getAllCategories', () => {
    test('debe obtener categorías de la API', async () => {
      const mockCategories = ['smartphones', 'laptops', 'tablets'];
      mockApiFetch.mockResolvedValue(mockCategories);

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(3);
    });

    test('debe usar cache para categorías', async () => {
      // Aprovecha el cache del test anterior
      const result1 = await getAllCategories();
      const result2 = await getAllCategories();

      expect(result1).toBe(result2);
      expect(result1).toHaveLength(3);
    });
  });

  describe('comportamiento del cache', () => {
    test('productos y categorías deben tener caches independientes', async () => {
      // Los caches ya están poblados por los tests anteriores
      const products = await getAllProducts();
      const categories = await getAllCategories();

      expect(products).toHaveLength(2);
      expect(categories).toHaveLength(3);
      expect(products).not.toBe(categories);
    });
  });
});