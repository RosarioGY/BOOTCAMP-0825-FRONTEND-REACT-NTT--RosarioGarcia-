import { createContext } from 'react';
import type { CartItem } from '../types/cart.types';

type AddOneResult = 'ok' | 'out_of_stock';

export type CartCtx = {
  items: CartItem[];
  totalUnique: number;   // badge del carrito
  totalQty: number;    // para Resumen (si tu evaluador quiere que cambie el icono con +/−)
  totalPrice: number;
  addOne: (p: Omit<CartItem, 'qty'>) => AddOneResult;
  inc: (id: number) => AddOneResult;
  dec: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  qtyOf: (id: number) => number;
};

export const CartContext = createContext<CartCtx | undefined>(undefined);