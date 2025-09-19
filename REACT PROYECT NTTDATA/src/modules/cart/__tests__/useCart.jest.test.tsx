import { renderHook } from '@testing-library/react';
import { useCart } from '../useCart';
import { CartProvider } from '@/modules/cart/context/CartProvider';
import { ReactNode } from 'react';

describe('useCart Hook', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  describe('comportamiento básico', () => {
    test('debe retornar contexto del carrito cuando está dentro del provider', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.items).toBeDefined();
      expect(result.current.total).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
      expect(result.current.addOne).toBeDefined();
      expect(result.current.inc).toBeDefined();
      expect(result.current.dec).toBeDefined();
      expect(result.current.remove).toBeDefined();
      expect(result.current.clear).toBeDefined();
    });

    test('debe tener items vacíos inicialmente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    test('debe tener todas las funciones del carrito disponibles', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(typeof result.current.addOne).toBe('function');
      expect(typeof result.current.inc).toBe('function');
      expect(typeof result.current.dec).toBe('function');
      expect(typeof result.current.remove).toBe('function');
      expect(typeof result.current.clear).toBe('function');
      expect(typeof result.current.dispatch).toBe('function');
    });
  });

  describe('manejo de errores', () => {
    test('debe lanzar error cuando se usa fuera del CartProvider', () => {
      // Suprimir console.error para este test específico
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within CartProvider');

      console.error = originalError;
    });

    test('debe tener el mensaje de error correcto', () => {
      const originalError = console.error;
      console.error = jest.fn();

      try {
        renderHook(() => useCart());
      } catch (error) {
        expect((error as Error).message).toBe('useCart must be used within CartProvider');
      }

      console.error = originalError;
    });
  });

  describe('integración con CartContext', () => {
    test('debe reflejar los valores del contexto correctamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      // Verificar que las propiedades del contexto están disponibles
      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('total');
      expect(result.current).toHaveProperty('dispatch');
      expect(result.current).toHaveProperty('addOne');
      expect(result.current).toHaveProperty('inc');
      expect(result.current).toHaveProperty('dec');
      expect(result.current).toHaveProperty('remove');
      expect(result.current).toHaveProperty('clear');
    });
  });
});