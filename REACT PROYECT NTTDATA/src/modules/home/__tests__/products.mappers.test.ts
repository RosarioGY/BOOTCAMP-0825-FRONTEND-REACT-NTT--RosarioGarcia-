// products.mappers.test.ts - Tests for Products Mappers
import type { RawProduct, Product } from '@/modules/home/types/products.types';
import { mapProduct, mapProducts } from '@/modules/home/mappers/products.mappers';

describe('Products Mappers', () => {
  const mockRawProduct: RawProduct = {
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
    images: [
      'https://i.dummyjson.com/data/products/1/1.jpg',
      'https://i.dummyjson.com/data/products/1/2.jpg'
    ]
  };

  const expectedProduct: Product = {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg'
  };

  describe('mapProduct function', () => {
    it('debe mapear correctamente un producto raw a producto', () => {
      const result = mapProduct(mockRawProduct);
      expect(result).toEqual(expectedProduct);
    });

    it('debe incluir todas las propiedades necesarias', () => {
      const result = mapProduct(mockRawProduct);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('stock');
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('thumbnail');
    });

    it('debe excluir propiedades no necesarias del raw product', () => {
      const result = mapProduct(mockRawProduct);
      
      expect(result).not.toHaveProperty('discountPercentage');
      expect(result).not.toHaveProperty('images');
    });

    it('debe preservar los valores exactos de las propiedades', () => {
      const result = mapProduct(mockRawProduct);
      
      expect(result.id).toBe(1);
      expect(result.title).toBe('iPhone 9');
      expect(result.description).toBe('An apple mobile which is nothing like apple');
      expect(result.price).toBe(549);
      expect(result.rating).toBe(4.69);
      expect(result.stock).toBe(94);
      expect(result.brand).toBe('Apple');
      expect(result.category).toBe('smartphones');
      expect(result.thumbnail).toBe('https://i.dummyjson.com/data/products/1/thumbnail.jpg');
    });

    it('debe manejar strings vacíos correctamente', () => {
      const rawWithEmptyStrings: RawProduct = {
        ...mockRawProduct,
        title: '',
        description: '',
        brand: '',
        category: '',
        thumbnail: ''
      };

      const result = mapProduct(rawWithEmptyStrings);
      
      expect(result.title).toBe('');
      expect(result.description).toBe('');
      expect(result.brand).toBe('');
      expect(result.category).toBe('');
      expect(result.thumbnail).toBe('');
    });

    it('debe manejar valores numéricos cero correctamente', () => {
      const rawWithZeros: RawProduct = {
        ...mockRawProduct,
        id: 0,
        price: 0,
        rating: 0,
        stock: 0
      };

      const result = mapProduct(rawWithZeros);
      
      expect(result.id).toBe(0);
      expect(result.price).toBe(0);
      expect(result.rating).toBe(0);
      expect(result.stock).toBe(0);
    });

    it('debe manejar valores numéricos negativos', () => {
      const rawWithNegatives: RawProduct = {
        ...mockRawProduct,
        price: -100,
        rating: -1,
        stock: -5
      };

      const result = mapProduct(rawWithNegatives);
      
      expect(result.price).toBe(-100);
      expect(result.rating).toBe(-1);
      expect(result.stock).toBe(-5);
    });

    it('debe manejar números decimales largos', () => {
      const rawWithDecimals: RawProduct = {
        ...mockRawProduct,
        price: 999.999999,
        rating: 4.666666667
      };

      const result = mapProduct(rawWithDecimals);
      
      expect(result.price).toBe(999.999999);
      expect(result.rating).toBe(4.666666667);
    });
  });

  describe('mapProducts function', () => {
    it('debe mapear correctamente un array de productos raw', () => {
      const rawProducts: RawProduct[] = [
        mockRawProduct,
        {
          ...mockRawProduct,
          id: 2,
          title: 'iPhone X',
          price: 899
        }
      ];

      const expectedProducts: Product[] = [
        expectedProduct,
        {
          ...expectedProduct,
          id: 2,
          title: 'iPhone X',
          price: 899
        }
      ];

      const result = mapProducts(rawProducts);
      expect(result).toEqual(expectedProducts);
    });

    it('debe preservar el orden de los productos', () => {
      const rawProducts: RawProduct[] = [
        { ...mockRawProduct, id: 1, title: 'Producto A' },
        { ...mockRawProduct, id: 2, title: 'Producto B' },
        { ...mockRawProduct, id: 3, title: 'Producto C' }
      ];

      const result = mapProducts(rawProducts);
      
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Producto A');
      expect(result[1].id).toBe(2);
      expect(result[1].title).toBe('Producto B');
      expect(result[2].id).toBe(3);
      expect(result[2].title).toBe('Producto C');
    });

    it('debe mapear cada producto individualmente', () => {
      const rawProducts: RawProduct[] = [
        mockRawProduct,
        { ...mockRawProduct, id: 2 }
      ];

      const result = mapProducts(rawProducts);
      
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('discountPercentage');
      expect(result[0]).not.toHaveProperty('images');
      expect(result[1]).not.toHaveProperty('discountPercentage');
      expect(result[1]).not.toHaveProperty('images');
    });

    it('debe manejar array vacío', () => {
      const result = mapProducts([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe manejar array con un solo elemento', () => {
      const result = mapProducts([mockRawProduct]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expectedProduct);
    });

    it('debe crear una nueva instancia del array', () => {
      const rawProducts: RawProduct[] = [mockRawProduct];
      const result = mapProducts(rawProducts);
      
      expect(result).not.toBe(rawProducts);
    });

    it('debe crear nuevas instancias de cada objeto producto', () => {
      const rawProducts: RawProduct[] = [mockRawProduct];
      const result = mapProducts(rawProducts);
      
      expect(result[0]).not.toBe(mockRawProduct);
    });
  });

  describe('casos edge y robustez', () => {
    it('mapProduct debe manejar propiedades faltantes gracefully', () => {
      // TypeScript no permitiría esto normalmente, pero simulamos un caso edge
      const incompleteRaw = {
        id: 1,
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        rating: 5
        // Faltan: stock, brand, category, thumbnail, discountPercentage, images
      } as RawProduct;

      expect(() => mapProduct(incompleteRaw)).not.toThrow();
    });

    it('mapProducts debe manejar productos con diferentes estructuras', () => {
      const mixedRawProducts: RawProduct[] = [
        mockRawProduct,
        {
          ...mockRawProduct,
          id: 2,
          price: 0,
          stock: 1000,
          title: 'Producto Especial'
        }
      ];

      const result = mapProducts(mixedRawProducts);
      
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(549);
      expect(result[1].price).toBe(0);
      expect(result[1].stock).toBe(1000);
      expect(result[1].title).toBe('Producto Especial');
    });
  });

  describe('immutability tests', () => {
    it('mapProduct no debe mutar el objeto raw original', () => {
      const originalRaw = { ...mockRawProduct };
      const result = mapProduct(mockRawProduct);
      
      expect(mockRawProduct).toEqual(originalRaw);
      
      // Modificar el resultado no debe afectar el original
      result.title = 'Modified Title';
      expect(mockRawProduct.title).toBe('iPhone 9');
    });

    it('mapProducts no debe mutar el array raw original', () => {
      const rawProducts: RawProduct[] = [mockRawProduct];
      const originalLength = rawProducts.length;
      const originalFirst = { ...rawProducts[0] };
      
      const result = mapProducts(rawProducts);
      
      expect(rawProducts).toHaveLength(originalLength);
      expect(rawProducts[0]).toEqual(originalFirst);
      
      // Modificar el resultado no debe afectar el original
      result.push({} as Product);
      expect(rawProducts).toHaveLength(originalLength);
    });
  });

  describe('type safety and completeness', () => {
    it('el resultado debe cumplir con la interfaz Product completa', () => {
      const result = mapProduct(mockRawProduct);
      
      // Verificar que tiene exactamente las propiedades de Product
      const productKeys = ['id', 'title', 'description', 'price', 'rating', 'stock', 'brand', 'category', 'thumbnail'];
      const resultKeys = Object.keys(result);
      
      productKeys.forEach(key => {
        expect(resultKeys).toContain(key);
      });
    });

    it('el resultado no debe tener propiedades extra de RawProduct', () => {
      const result = mapProduct(mockRawProduct);
      
      expect(result).not.toHaveProperty('discountPercentage');
      expect(result).not.toHaveProperty('images');
    });
  });
});