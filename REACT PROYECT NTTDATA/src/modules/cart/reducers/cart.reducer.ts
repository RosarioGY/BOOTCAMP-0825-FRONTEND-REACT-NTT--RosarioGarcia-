import type { CartItem } from '../types/cart.types';

export type CartAction =
  | { type: 'ADD_ONE'; payload: Omit<CartItem, 'qty'> }
  | { type: 'INC'; id: number }
  | { type: 'DEC'; id: number }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

export interface CartState { items: CartItem[]; }
export const initialCart: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ONE': {
      const found = state.items.find(i => i.id === action.payload.id);
      if (!found) return { items: [...state.items, { ...action.payload, qty: 1 }] };
      if (found.qty >= found.stock) return state;           // no exceder stock
      return { items: state.items.map(i => i.id === found.id ? { ...i, qty: i.qty + 1 } : i) };
    }
    case 'INC': {
      const it = state.items.find(i => i.id === action.id);
      if (!it || it.qty >= it.stock) return state;
      return { items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    }
    case 'DEC': {
      const it = state.items.find(i => i.id === action.id);
      if (!it) return state;
      if (it.qty <= 1) return { items: state.items.filter(i => i.id !== action.id) }; // 0 => remover
      return { items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i) };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR':
      return initialCart;
    default:
      return state;
  }
}
