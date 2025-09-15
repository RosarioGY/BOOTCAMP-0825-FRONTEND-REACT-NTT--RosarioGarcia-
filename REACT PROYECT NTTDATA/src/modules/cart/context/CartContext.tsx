import { useMemo, useReducer, useCallback } from 'react';
import { cartReducer, initialCart } from '../reducers/cart.reducer';
import { CartContext, type CartCtx } from './CartContext';

export function CartProvider({ children }: { children: React.ReactNode }) {
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

  const dec: CartCtx['dec'] = useCallback((id) => dispatch({ type: 'DEC', id }), []);
  const remove: CartCtx['remove'] = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);

  const value = useMemo<CartCtx>(() => {
    const totalUnique = state.items.length;
    const totalQty = state.items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);
    
    return {
      items: state.items,
      totalUnique,
      totalQty,
      totalPrice,
      addOne, inc, dec, remove,
      clear: () => dispatch({ type: 'CLEAR' }),
      qtyOf: (id: number) => state.items.find(i => i.id === id)?.qty ?? 0,
    };
  }, [state.items, addOne, inc, dec, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


