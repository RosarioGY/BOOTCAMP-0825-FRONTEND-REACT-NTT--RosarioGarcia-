import { createContext } from 'react';
import type { CartItem } from '@/modules/cart/types/cart.types';

type AddOneResult = 'ok' | 'out_of_stock';

export type CartCtx = {
  items: CartItem[];
  totalUnique: number;  
  totalQty: number;   
  totalPrice: number;
  addOne: (p: Omit<CartItem, 'qty'>) => AddOneResult;
  inc: (id: number) => AddOneResult;
  dec: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  qtyOf: (id: number) => number;
};

export const CartContext = createContext<CartCtx | undefined>(undefined);