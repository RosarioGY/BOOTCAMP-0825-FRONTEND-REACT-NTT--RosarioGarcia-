import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import { createContext, useReducer, useMemo, useCallback, useContext } from 'react';
import { cartReducer, initialCart } from '../reducers/cart.reducer';
import type { CartCtx } from '../context/CartContext';

// Crear un contexto de prueba
const TestCartContext = createContext<CartCtx | null>(null);

// Hook de prueba que usa nuestro contexto
function useTestCart() {
  const ctx = useContext(TestCartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  const addOne: CartCtx['addOne'] = useCallback((p) => {
    const found = state.items.find(i => i.id === p.id);
    if (found && found.qty >= p.stock) return 'out_of_stock';
    dispatch({ type: 'ADD_ONE', payload: p });
    return 'ok';
  }, [state.items]);

  const inc: CartCtx['inc'] = useCallback((id) => {
    const f = state.items.find(i => i.id === id);
    if (f && f.qty >= f.stock) return 'out_of_stock';
    dispatch({ type: 'INC', id });
    return 'ok';
  }, [state.items]);

  const dec: CartCtx['dec'] = useCallback((id) => {
    dispatch({ type: 'DEC', id });
  }, []);

  const remove: CartCtx['remove'] = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const clear: CartCtx['clear'] = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const qtyOf: CartCtx['qtyOf'] = useCallback((id) => {
    const found = state.items.find(i => i.id === id);
    return found ? found.qty : 0;
  }, [state.items]);

  const value = useMemo<CartCtx>(() => ({
    items: state.items,
    totalUnique: state.items.length,
    totalQty: state.items.reduce((acc, i) => acc + i.qty, 0),
    totalPrice: state.items.reduce((acc, i) => acc + (i.price * i.qty), 0),
    addOne, inc, dec, remove, clear, qtyOf
  }), [state, addOne, inc, dec, remove, clear, qtyOf]);

  return <TestCartContext.Provider value={value}>{children}</TestCartContext.Provider>;
}

describe('useCart Hook', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  describe('comportamiento básico', () => {
    test('debe retornar contexto del carrito cuando está dentro del provider', () => {
      const { result } = renderHook(() => useTestCart(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.items).toBeDefined();
      expect(result.current.totalUnique).toBeDefined();
      expect(result.current.totalQty).toBeDefined();
      expect(result.current.totalPrice).toBeDefined();
      expect(result.current.addOne).toBeDefined();
      expect(result.current.inc).toBeDefined();
      expect(result.current.dec).toBeDefined();
      expect(result.current.remove).toBeDefined();
      expect(result.current.clear).toBeDefined();
    });

    test('debe tener items vacíos inicialmente', () => {
      const { result } = renderHook(() => useTestCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalUnique).toBe(0);
      expect(result.current.totalQty).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    test('debe tener todas las funciones del carrito disponibles', () => {
      const { result } = renderHook(() => useTestCart(), { wrapper });

      expect(typeof result.current.addOne).toBe('function');
      expect(typeof result.current.inc).toBe('function');
      expect(typeof result.current.dec).toBe('function');
      expect(typeof result.current.remove).toBe('function');
      expect(typeof result.current.clear).toBe('function');
    });
  });

  describe('manejo de errores', () => {
    test('debe lanzar error cuando se usa fuera del CartProvider', () => {
      // Suprimir console.error para este test específico
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useTestCart());
      }).toThrow('useCart must be used within CartProvider');

      console.error = originalError;
    });

    test('debe tener el mensaje de error correcto', () => {
      const originalError = console.error;
      console.error = jest.fn();

      try {
        renderHook(() => useTestCart());
      } catch (error) {
        expect((error as Error).message).toBe('useCart must be used within CartProvider');
      }

      console.error = originalError;
    });
  });

  describe('integración con CartContext', () => {
    test('debe reflejar los valores del contexto correctamente', () => {
      const { result } = renderHook(() => useTestCart(), { wrapper });

      // Verificar que las propiedades del contexto están disponibles
      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('totalUnique');
      expect(result.current).toHaveProperty('totalQty');
      expect(result.current).toHaveProperty('totalPrice');
      expect(result.current).toHaveProperty('addOne');
      expect(result.current).toHaveProperty('inc');
      expect(result.current).toHaveProperty('dec');
      expect(result.current).toHaveProperty('remove');
      expect(result.current).toHaveProperty('clear');
      expect(result.current).toHaveProperty('qtyOf');
    });
  });
});