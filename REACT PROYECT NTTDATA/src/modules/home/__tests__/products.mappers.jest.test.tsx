// products.mappers.jest.test.tsx - Test unitario para products.mappers
import { mapProduct, mapProducts } from '@/modules/home/mappers/products.mappers';
import type { RawProduct, Product } from '@/modules/home/types/products.types';

describe('Products Mappers', () => {
  const sampleRawProduct: RawProduct = {
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features and titanium design',
    price: 999.99,
    discountPercentage: 12.5,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    images: [
      'https://cdn.dummyjson.com/product-images/1/1.jpg',
      'https://cdn.dummyjson.com/product-images/1/2.jpg',
      'https://cdn.dummyjson.com/product-images/1/3.jpg'
    ]
  };

  const expectedMappedProduct: Product = {
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features and titanium design',
    price: 999.99,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
  };

  const sampleRawProducts: RawProduct[] = [
    {
      id: 1,
      title: 'iPhone 15 Pro',
      description: 'Latest iPhone',
      price: 999,
      discountPercentage: 10,
      rating: 4.5,
      stock: 10,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'iphone.jpg',
      images: ['iphone1.jpg', 'iphone2.jpg']
    },
    {
      id: 2,
      title: 'MacBook Pro',
      description: 'Professional laptop',
      price: 1999,
      discountPercentage: 5,
      rating: 4.8,
      stock: 5,
      brand: 'Apple',
      category: 'laptops',
      thumbnail: 'macbook.jpg',
      images: ['macbook1.jpg']
    },
    {
      id: 3,
      title: 'Samsung Galaxy S24',
      description: 'Android smartphone',
      price: 899,
      discountPercentage: 15,
      rating: 4.3,
      stock: 8,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'galaxy.jpg',
      images: []
    }
  ];

  describe('mapProduct function', () => {
    test('debe mapear correctamente un producto raw a producto', () => {
      const result = mapProduct(sampleRawProduct);

      expect(result).toEqual(expectedMappedProduct);
    });

    test('debe incluir todas las propiedades necesarias', () => {
      const result = mapProduct(sampleRawProduct);

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

    test('debe excluir propiedades no necesarias del raw product', () => {
      const result = mapProduct(sampleRawProduct);

      expect(result).not.toHaveProperty('discountPercentage');
      expect(result).not.toHaveProperty('images');
    });

    test('debe preservar los valores exactos de las propiedades', () => {
      const result = mapProduct(sampleRawProduct);

      expect(result.id).toBe(1);
      expect(result.title).toBe('iPhone 15 Pro');
      expect(result.description).toBe('Latest iPhone with advanced features and titanium design');
      expect(result.price).toBe(999.99);
      expect(result.rating).toBe(4.69);
      expect(result.stock).toBe(94);
      expect(result.brand).toBe('Apple');
      expect(result.category).toBe('smartphones');
      expect(result.thumbnail).toBe('https://cdn.dummyjson.com/product-images/1/thumbnail.jpg');
    });

    test('debe manejar strings vacíos correctamente', () => {
      const rawProductWithEmptyStrings: RawProduct = {
        ...sampleRawProduct,
        title: '',
        description: '',
        brand: '',
        category: '',
        thumbnail: ''
      };

      const result = mapProduct(rawProductWithEmptyStrings);

      expect(result.title).toBe('');
      expect(result.description).toBe('');
      expect(result.brand).toBe('');
      expect(result.category).toBe('');
      expect(result.thumbnail).toBe('');
    });

    test('debe manejar valores numéricos cero correctamente', () => {
      const rawProductWithZeros: RawProduct = {
        ...sampleRawProduct,
        id: 0,
        price: 0,
        rating: 0,
        stock: 0
      };

      const result = mapProduct(rawProductWithZeros);

      expect(result.id).toBe(0);
      expect(result.price).toBe(0);
      expect(result.rating).toBe(0);
      expect(result.stock).toBe(0);
    });

    test('debe manejar valores numéricos negativos', () => {
      const rawProductWithNegatives: RawProduct = {
        ...sampleRawProduct,
        price: -50,
        rating: -1,
        stock: -10
      };

      const result = mapProduct(rawProductWithNegatives);

      expect(result.price).toBe(-50);
      expect(result.rating).toBe(-1);
      expect(result.stock).toBe(-10);
    });

    test('debe manejar números decimales largos', () => {
      const rawProductWithDecimals: RawProduct = {
        ...sampleRawProduct,
        price: 999.999999,
        rating: 4.123456789
      };

      const result = mapProduct(rawProductWithDecimals);

      expect(result.price).toBe(999.999999);
      expect(result.rating).toBe(4.123456789);
    });
  });

  describe('mapProducts function', () => {

    test('debe mapear correctamente un array de productos raw', () => {
      const result = mapProducts(sampleRawProducts);

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('iPhone 15 Pro');
      expect(result[1].title).toBe('MacBook Pro');
      expect(result[2].title).toBe('Samsung Galaxy S24');
    });

    test('debe preservar el orden de los productos', () => {
      const result = mapProducts(sampleRawProducts);

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    test('debe mapear cada producto individualmente', () => {
      const result = mapProducts(sampleRawProducts);

      result.forEach((mappedProduct, index) => {
        const expectedMapped = mapProduct(sampleRawProducts[index]);
        expect(mappedProduct).toEqual(expectedMapped);
      });
    });

    test('debe manejar array vacío', () => {
      const result = mapProducts([]);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    test('debe manejar array con un solo elemento', () => {
      const singleRawProduct = [sampleRawProducts[0]];
      const result = mapProducts(singleRawProduct);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mapProduct(sampleRawProducts[0]));
    });

    test('debe crear una nueva instancia del array', () => {
      const result = mapProducts(sampleRawProducts);

      expect(result).not.toBe(sampleRawProducts);
      expect(Array.isArray(result)).toBe(true);
    });

    test('debe crear nuevas instancias de cada objeto producto', () => {
      const result = mapProducts(sampleRawProducts);

      result.forEach((mappedProduct, index) => {
        expect(mappedProduct).not.toBe(sampleRawProducts[index]);
      });
    });
  });

  describe('casos edge y robustez', () => {
    test('mapProduct debe manejar propiedades faltantes gracefully', () => {
      // Simular un producto con propiedades faltantes (aunque TypeScript no lo permita)
      const incompleteRawProduct = {
        id: 1,
        title: 'Test Product',
        description: '', // description presente pero vacía
        price: 100,
        rating: 0, // rating presente pero cero
        stock: 5,
        brand: 'Test Brand',
        category: 'test',
        thumbnail: 'test.jpg',
        discountPercentage: 10,
        images: []
      } as RawProduct;

      const result = mapProduct(incompleteRawProduct);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Product');
      expect(result.price).toBe(100);
      expect(result.stock).toBe(5);
      expect(result.brand).toBe('Test Brand');
      expect(result.category).toBe('test');
      expect(result.thumbnail).toBe('test.jpg');
    });

    test('mapProducts debe manejar productos con diferentes estructuras', () => {
      const mixedRawProducts = [
        sampleRawProducts[0], // Producto completo
        {
          id: 999,
          title: 'Minimal Product',
          description: 'Basic product',
          price: 50,
          rating: 3,
          stock: 1,
          brand: 'Generic',
          category: 'other',
          thumbnail: 'generic.jpg',
          discountPercentage: 0,
          images: []
        }
      ];

      const result = mapProducts(mixedRawProducts);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('iPhone 15 Pro');
      expect(result[1].title).toBe('Minimal Product');
    });
  });

  describe('immutability tests', () => {
    test('mapProduct no debe mutar el objeto raw original', () => {
      const originalRawProduct = { ...sampleRawProduct };
      const result = mapProduct(sampleRawProduct);

      expect(sampleRawProduct).toEqual(originalRawProduct);
      
      // Modificar el resultado no debe afectar el original
      result.title = 'Modified Title';
      expect(sampleRawProduct.title).toBe('iPhone 15 Pro');
    });

    test('mapProducts no debe mutar el array raw original', () => {
      const originalRawProducts = [...sampleRawProducts];
      const originalFirstProduct = { ...sampleRawProducts[0] };
      
      const result = mapProducts(sampleRawProducts);

      expect(sampleRawProducts).toEqual(originalRawProducts);
      expect(sampleRawProducts[0]).toEqual(originalFirstProduct);

      // Modificar el resultado no debe afectar el original
      result[0].title = 'Modified Title';
      expect(sampleRawProducts[0].title).toBe('iPhone 15 Pro');
    });
  });

  describe('type safety and completeness', () => {
    test('el resultado debe cumplir con la interfaz Product completa', () => {
      const result = mapProduct(sampleRawProduct);

      // Verificar que todas las propiedades required de Product estén presentes
      const requiredKeys: (keyof Product)[] = [
        'id', 'title', 'description', 'price', 'rating', 
        'stock', 'brand', 'category', 'thumbnail'
      ];

      requiredKeys.forEach(key => {
        expect(result).toHaveProperty(key);
        expect(result[key]).toBeDefined();
      });
    });

    test('el resultado no debe tener propiedades extra de RawProduct', () => {
      const result = mapProduct(sampleRawProduct);

      // Verificar que las propiedades específicas de RawProduct no estén presentes
      expect(result).not.toHaveProperty('discountPercentage');
      expect(result).not.toHaveProperty('images');
    });
  });
});