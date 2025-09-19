// locale.test.ts - Unit tests for locale utilities
import '@testing-library/jest-dom';
import { 
  CATEGORY_ES, 
  uiES, 
  formatPricePEN, 
  USD_TO_PEN, 
  usdToPen, 
  capitalize 
} from '../locale';

describe('Locale Utilities', () => {
  describe('CATEGORY_ES translations', () => {
    it('should contain all expected category translations', () => {
      expect(CATEGORY_ES).toBeDefined();
      expect(typeof CATEGORY_ES).toBe('object');
    });

    it('should translate beauty category correctly', () => {
      expect(CATEGORY_ES.beauty).toBe('Belleza');
    });

    it('should translate furniture category correctly', () => {
      expect(CATEGORY_ES.furniture).toBe('Muebles');
    });

    it('should translate fragrances category correctly', () => {
      expect(CATEGORY_ES.fragrances).toBe('Fragancias');
    });

    it('should translate groceries category correctly', () => {
      expect(CATEGORY_ES.groceries).toBe('Abarrotes');
    });

    it('should translate home-decoration category correctly', () => {
      expect(CATEGORY_ES['home-decoration']).toBe('Decoración del hogar');
    });

    it('should translate laptops category correctly', () => {
      expect(CATEGORY_ES.laptops).toBe('Portátiles');
    });

    it('should translate smartphones category correctly', () => {
      expect(CATEGORY_ES.smartphones).toBe('Teléfonos');
    });

    it('should handle all categories without undefined values', () => {
      const categories = Object.values(CATEGORY_ES);
      expect(categories).not.toContain(undefined);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe('uiES translations', () => {
    it('should contain all expected UI translations', () => {
      expect(uiES).toBeDefined();
      expect(typeof uiES).toBe('object');
    });

    it('should translate addToCart correctly', () => {
      expect(uiES.addToCart).toBe('Agregar al carrito');
    });

    it('should translate stock correctly', () => {
      expect(uiES.stock).toBe('Stock');
    });

    it('should translate searchPlaceholder correctly', () => {
      expect(uiES.searchPlaceholder).toBe('Buscar productos… (mínimo 3 caracteres)');
    });

    it('should translate all correctly', () => {
      expect(uiES.all).toBe('Todos');
    });
  });

  describe('formatPricePEN function', () => {
    it('should format price in PEN currency', () => {
      const result = formatPricePEN(100);
      expect(result).toContain('S/');
      expect(result).toContain('100');
    });

    it('should format zero correctly', () => {
      const result = formatPricePEN(0);
      expect(result).toContain('S/');
      expect(result).toContain('0');
    });

    it('should format decimal numbers correctly', () => {
      const result = formatPricePEN(99.99);
      expect(result).toContain('S/');
      expect(result).toContain('99.99');
    });

    it('should format large numbers correctly', () => {
      const result = formatPricePEN(1000);
      expect(result).toContain('S/');
      expect(result).toContain('1,000');
    });

    it('should format negative numbers correctly', () => {
      const result = formatPricePEN(-50);
      expect(result).toContain('S/');
      expect(result).toContain('50');
    });
  });

  describe('USD to PEN conversion', () => {
    it('should have USD_TO_PEN constant', () => {
      expect(USD_TO_PEN).toBeDefined();
      expect(typeof USD_TO_PEN).toBe('number');
      expect(USD_TO_PEN).toBe(3.75);
    });

    it('should convert USD to PEN with default rate', () => {
      const result = usdToPen(100);
      expect(result).toBe(375); // 100 * 3.75
    });

    it('should convert USD to PEN with custom rate', () => {
      const result = usdToPen(100, 4.0);
      expect(result).toBe(400);
    });

    it('should handle zero USD amount', () => {
      const result = usdToPen(0);
      expect(result).toBe(0);
    });

    it('should handle decimal USD amounts', () => {
      const result = usdToPen(10.5);
      expect(result).toBe(39.375); // 10.5 * 3.75
    });

    it('should handle negative USD amounts', () => {
      const result = usdToPen(-50);
      expect(result).toBe(-187.5);
    });
  });

  describe('capitalize function', () => {
    it('should capitalize first letter of lowercase string', () => {
      const result = capitalize('hello');
      expect(result).toBe('Hello');
    });

    it('should capitalize first letter and lowercase the rest', () => {
      const result = capitalize('hELLO WORLD');
      expect(result).toBe('Hello world');
    });

    it('should handle empty string', () => {
      const result = capitalize('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = capitalize('a');
      expect(result).toBe('A');
    });

    it('should handle single uppercase character', () => {
      const result = capitalize('A');
      expect(result).toBe('A');
    });

    it('should handle strings with spaces', () => {
      const result = capitalize('hello world');
      expect(result).toBe('Hello world');
    });

    it('should handle strings with numbers', () => {
      const result = capitalize('hello123');
      expect(result).toBe('Hello123');
    });

    it('should handle strings with special characters', () => {
      const result = capitalize('hello-world!');
      expect(result).toBe('Hello-world!');
    });

    it('should handle undefined/null gracefully', () => {
      expect(capitalize(null as unknown as string)).toBe(null);
      expect(capitalize(undefined as unknown as string)).toBe(undefined);
    });
  });

  describe('Integration tests', () => {
    it('should work together for complete localization', () => {
      const category = CATEGORY_ES.beauty;
      const capitalizedCategory = capitalize(category);
      const price = formatPricePEN(usdToPen(25.5));
      
      expect(capitalizedCategory).toBe('Belleza');
      expect(price).toContain('S/');
      expect(price).toContain('95.63');
    });

    it('should handle category lookup with UI text', () => {
      const category = CATEGORY_ES.smartphones || uiES.all;
      expect(category).toBe('Teléfonos');
    });
  });
});