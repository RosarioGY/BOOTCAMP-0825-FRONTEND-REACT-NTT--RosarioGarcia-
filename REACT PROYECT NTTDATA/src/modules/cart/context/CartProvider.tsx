import { useMemo, useReducer, useCallback } from 'react';
import { cartReducer, initialCart } from '@/modules/cart/reducers/cart.reducer';
import { CartContext, type CartCtx } from '@/modules/cart/context/CartContext';
import type { CartItem } from '@/modules/cart/types/cart.types';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  // Corregido: Mantenemos la validación de stock pero optimizamos las dependencias
  const addOne: CartCtx['addOne'] = useCallback((p: Omit<CartItem, 'qty'>) => {
    const found = state.items.find((i: CartItem) => i.id === p.id);
    if (found && found.qty >= p.stock) return 'out_of_stock';
    dispatch({ type: 'ADD_ONE', payload: p });
    return 'ok';
  }, [state.items]);

  const inc: CartCtx['inc'] = useCallback((id: number) => {
    const f = state.items.find((i: CartItem) => i.id === id);
    if (f && f.qty >= f.stock) return 'out_of_stock';
    dispatch({ type: 'INC', id });
    return 'ok';
  }, [state.items]);

  const dec: CartCtx['dec'] = useCallback((id: number) => dispatch({ type: 'DEC', id }), []);
  const remove: CartCtx['remove'] = useCallback((id: number) => dispatch({ type: 'REMOVE', id }), []);

  // Corregido: Extraemos las funciones del useMemo para evitar dependencias circulares
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const qtyOf = useCallback((id: number) => state.items.find((i: CartItem) => i.id === id)?.qty ?? 0, [state.items]);

  const value = useMemo<CartCtx>(() => {
    const totalUnique = state.items.length;
    const totalQty = state.items.reduce((s: number, i: CartItem) => s + i.qty, 0);
    const totalPrice = state.items.reduce((s: number, i: CartItem) => s + i.price * i.qty, 0);
    
    return {
      items: state.items,
      totalUnique,
      totalQty,
      totalPrice,
      addOne,
      inc,
      dec,
      remove,
      clear,
      qtyOf,
    };
  }, [state.items, addOne, inc, dec, remove, clear, qtyOf]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


