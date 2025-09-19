// cart.reducer.jest.test.ts - Tests unitarios para cart.reducer
import { cartReducer, initialCart, type CartAction, type CartState } from '@/modules/cart/reducers/cart.reducer';
import type { CartItem } from '@/modules/cart/types/cart.types';

describe('Cart Reducer', () => {
  const mockItem1: Omit<CartItem, 'qty'> = {
    id: 1,
    title: 'iPhone 15',
    price: 999,
    thumbnail: 'iphone.jpg',
    stock: 10
  };

  const mockItem2: Omit<CartItem, 'qty'> = {
    id: 2,
    title: 'MacBook Pro',
    price: 1999,
    thumbnail: 'macbook.jpg',
    stock: 5
  };

  const mockCartWithItems: CartState = {
    items: [
      { ...mockItem1, qty: 2 },
      { ...mockItem2, qty: 1 }
    ]
  };

  describe('ADD_ONE action', () => {
    test('debe agregar nuevo item con qty 1 cuando no existe', () => {
      const action: CartAction = { type: 'ADD_ONE', payload: mockItem1 };
      const result = cartReducer(initialCart, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ ...mockItem1, qty: 1 });
    });

    test('debe incrementar qty cuando item ya existe y no excede stock', () => {
      const state: CartState = { items: [{ ...mockItem1, qty: 3 }] };
      const action: CartAction = { type: 'ADD_ONE', payload: mockItem1 };
      const result = cartReducer(state, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].qty).toBe(4);
    });

    test('no debe incrementar qty cuando se alcanza el stock máximo', () => {
      const state: CartState = { items: [{ ...mockItem1, qty: 10 }] }; // qty = stock
      const action: CartAction = { type: 'ADD_ONE', payload: mockItem1 };
      const result = cartReducer(state, action);

      expect(result).toBe(state); // Estado inmutable sin cambios
      expect(result.items[0].qty).toBe(10);
    });

    test('debe mantener otros items sin cambios al agregar nuevo', () => {
      const action: CartAction = { type: 'ADD_ONE', payload: mockItem2 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual({ ...mockItem1, qty: 2 }); // Sin cambios
      expect(result.items[1].qty).toBe(2); // mockItem2 incrementado
    });
  });

  describe('INC action', () => {
    test('debe incrementar qty de item existente', () => {
      const action: CartAction = { type: 'INC', id: 1 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items[0].qty).toBe(3); // De 2 a 3
      expect(result.items[1].qty).toBe(1); // Sin cambios
    });

    test('no debe incrementar cuando item no existe', () => {
      const action: CartAction = { type: 'INC', id: 999 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result).toBe(mockCartWithItems); // Sin cambios
    });

    test('no debe incrementar cuando se alcanza stock máximo', () => {
      const state: CartState = { items: [{ ...mockItem1, qty: 10 }] };
      const action: CartAction = { type: 'INC', id: 1 };
      const result = cartReducer(state, action);

      expect(result).toBe(state); // Sin cambios
      expect(result.items[0].qty).toBe(10);
    });
  });

  describe('DEC action', () => {
    test('debe decrementar qty cuando es mayor a 1', () => {
      const action: CartAction = { type: 'DEC', id: 1 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items[0].qty).toBe(1); // De 2 a 1
      expect(result.items).toHaveLength(2); // Item sigue en carrito
    });

    test('debe remover item cuando qty es 1', () => {
      const state: CartState = { items: [{ ...mockItem1, qty: 1 }] };
      const action: CartAction = { type: 'DEC', id: 1 };
      const result = cartReducer(state, action);

      expect(result.items).toHaveLength(0); // Item removido
    });

    test('no debe cambiar nada cuando item no existe', () => {
      const action: CartAction = { type: 'DEC', id: 999 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result).toBe(mockCartWithItems); // Sin cambios
    });

    test('debe mantener otros items sin cambios', () => {
      const action: CartAction = { type: 'DEC', id: 2 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items).toHaveLength(1); // mockItem2 removido (qty era 1)
      expect(result.items[0]).toEqual({ ...mockItem1, qty: 2 }); // Sin cambios
    });
  });

  describe('REMOVE action', () => {
    test('debe remover item específico del carrito', () => {
      const action: CartAction = { type: 'REMOVE', id: 1 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(2); // Solo queda mockItem2
    });

    test('no debe cambiar nada cuando item no existe', () => {
      const action: CartAction = { type: 'REMOVE', id: 999 };
      const result = cartReducer(mockCartWithItems, action);

      expect(result.items).toEqual(mockCartWithItems.items); // Mismo contenido
      expect(result.items).toHaveLength(2);
    });

    test('debe poder remover todos los items individualmente', () => {
      let state = mockCartWithItems;
      
      state = cartReducer(state, { type: 'REMOVE', id: 1 });
      expect(state.items).toHaveLength(1);
      
      state = cartReducer(state, { type: 'REMOVE', id: 2 });
      expect(state.items).toHaveLength(0);
    });
  });

  describe('CLEAR action', () => {
    test('debe vaciar completamente el carrito', () => {
      const action: CartAction = { type: 'CLEAR' };
      const result = cartReducer(mockCartWithItems, action);

      expect(result).toEqual(initialCart);
      expect(result.items).toHaveLength(0);
    });

    test('debe mantener estructura de initialCart al limpiar', () => {
      const action: CartAction = { type: 'CLEAR' };
      const result = cartReducer(mockCartWithItems, action);

      expect(result).toBe(initialCart); // Referencia exacta
    });
  });

  describe('estado inicial y casos edge', () => {
    test('debe devolver estado inicial por defecto', () => {
      expect(initialCart).toEqual({ items: [] });
    });

    test('debe manejar acciones desconocidas sin cambios', () => {
      const unknownAction = { type: 'UNKNOWN' } as unknown as CartAction;
      const result = cartReducer(mockCartWithItems, unknownAction);

      expect(result).toBe(mockCartWithItems); // Sin cambios
    });

    test('debe preservar inmutabilidad del estado', () => {
      const originalState = { items: [{ ...mockItem1, qty: 1 }] };
      const action: CartAction = { type: 'INC', id: 1 };
      const result = cartReducer(originalState, action);

      expect(result).not.toBe(originalState); // Nuevo objeto
      expect(result.items).not.toBe(originalState.items); // Nuevo array
      expect(originalState.items[0].qty).toBe(1); // Estado original intacto
    });
  });
});