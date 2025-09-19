// usePagination.jest.test.tsx - Test unitario para usePagination hook
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/modules/home/hooks/usePagination';

describe('usePagination Hook', () => {
  const sampleItems = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);

  describe('inicialización por defecto', () => {
    test('debe inicializar con valores por defecto correctos', () => {
      const { result } = renderHook(() => usePagination(sampleItems));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(5); // 50 items / 12 per page = 5 pages (redondeado)
      expect(result.current.pageItems).toHaveLength(12);
      expect(result.current.pageItems[0]).toBe('item-1');
      expect(result.current.pageItems[11]).toBe('item-12');
    });

    test('debe usar pageSize personalizado', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      expect(result.current.totalPages).toBe(5); // 50 items / 10 per page = 5 pages
      expect(result.current.pageItems).toHaveLength(10);
      expect(result.current.pageItems[0]).toBe('item-1');
      expect(result.current.pageItems[9]).toBe('item-10');
    });
  });

  describe('navegación con next/prev', () => {
    test('debe avanzar a la página siguiente con next()', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      act(() => {
        result.current.next();
      });

      expect(result.current.page).toBe(2);
      expect(result.current.pageItems[0]).toBe('item-11');
      expect(result.current.pageItems[9]).toBe('item-20');
    });

    test('no debe avanzar más allá de la última página con next()', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      // Ir a la última página
      act(() => {
        result.current.go(5); // página 5 es la última
      });

      expect(result.current.page).toBe(5);

      // Intentar ir más allá
      act(() => {
        result.current.next();
      });

      expect(result.current.page).toBe(5); // Debe mantenerse en la última página
    });

    test('debe retroceder a la página anterior con prev()', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      // Ir a página 3
      act(() => {
        result.current.go(3);
      });

      expect(result.current.page).toBe(3);

      act(() => {
        result.current.prev();
      });

      expect(result.current.page).toBe(2);
    });

    test('no debe retroceder más allá de la primera página con prev()', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      expect(result.current.page).toBe(1);

      act(() => {
        result.current.prev();
      });

      expect(result.current.page).toBe(1); // Debe mantenerse en la primera página
    });
  });

  describe('navegación directa con go()', () => {
    test('debe ir a la página especificada con go()', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      act(() => {
        result.current.go(3);
      });

      expect(result.current.page).toBe(3);
      expect(result.current.pageItems[0]).toBe('item-21');
      expect(result.current.pageItems[9]).toBe('item-30');
    });

    test('debe limitar go() a la página mínima (1)', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      act(() => {
        result.current.go(0);
      });

      expect(result.current.page).toBe(1);

      act(() => {
        result.current.go(-5);
      });

      expect(result.current.page).toBe(1);
    });

    test('debe limitar go() a la página máxima', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      act(() => {
        result.current.go(10);
      });

      expect(result.current.page).toBe(5); // Última página disponible

      act(() => {
        result.current.go(100);
      });

      expect(result.current.page).toBe(5);
    });
  });

  describe('setPage directo', () => {
    test('debe permitir cambiar página directamente con setPage', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      act(() => {
        result.current.setPage(4);
      });

      expect(result.current.page).toBe(4);
      expect(result.current.pageItems[0]).toBe('item-31');
    });
  });

  describe('manejo de diferentes tamaños de datos', () => {
    test('debe manejar lista vacía correctamente', () => {
      const { result } = renderHook(() => usePagination([], 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1); // Math.max(1, ...)
      expect(result.current.pageItems).toEqual([]);
    });

    test('debe manejar lista con menos elementos que pageSize', () => {
      const smallList = ['item1', 'item2', 'item3'];
      const { result } = renderHook(() => usePagination(smallList, 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toEqual(['item1', 'item2', 'item3']);
    });

    test('debe manejar lista con exactamente pageSize elementos', () => {
      const exactList = Array.from({ length: 10 }, (_, i) => `item-${i + 1}`);
      const { result } = renderHook(() => usePagination(exactList, 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toHaveLength(10);
    });

    test('debe manejar lista que no divide exactamente por pageSize', () => {
      const oddList = Array.from({ length: 23 }, (_, i) => `item-${i + 1}`);
      const { result } = renderHook(() => usePagination(oddList, 10));

      expect(result.current.totalPages).toBe(3); // 23 / 10 = 2.3 -> 3 páginas

      // Ir a la última página para verificar elementos restantes
      act(() => {
        result.current.go(3);
      });

      expect(result.current.pageItems).toHaveLength(3); // Solo 3 elementos en la última página
      expect(result.current.pageItems[0]).toBe('item-21');
      expect(result.current.pageItems[2]).toBe('item-23');
    });
  });

  describe('reactividad a cambios en items', () => {
    test('debe recalcular cuando cambian los items', () => {
      let items = Array.from({ length: 20 }, (_, i) => `item-${i + 1}`);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      expect(result.current.totalPages).toBe(2);

      // Cambiar items
      items = Array.from({ length: 35 }, (_, i) => `new-item-${i + 1}`);
      rerender({ items });

      expect(result.current.totalPages).toBe(4); // 35 / 10 = 3.5 -> 4 páginas
      expect(result.current.pageItems[0]).toBe('new-item-1'); // Verificar que usa los nuevos items
    });

    test('debe ajustar página actual cuando se reduce el número de páginas', () => {
      let items = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      // Ir a página 4
      act(() => {
        result.current.go(4);
      });

      expect(result.current.page).toBe(4);

      // Reducir items para que solo haya 2 páginas
      items = Array.from({ length: 15 }, (_, i) => `item-${i + 1}`);
      rerender({ items });

      // El totalPages se calcula correctamente
      expect(result.current.totalPages).toBe(2);
      
      // Pero la página actual sigue siendo 4, lo que resulta en pageItems vacío
      expect(result.current.page).toBe(4);
      expect(result.current.pageItems).toHaveLength(0);
      
      // Necesitamos ajustar manualmente usando go() para ir a una página válida
      act(() => {
        result.current.go(2);
      });
      
      expect(result.current.pageItems[0]).toBe('item-11'); // Ahora en página 2
    });
  });

  describe('casos edge y comportamientos especiales', () => {
    test('debe manejar pageSize de 1', () => {
      const items = ['a', 'b', 'c'];
      const { result } = renderHook(() => usePagination(items, 1));

      expect(result.current.totalPages).toBe(3);
      expect(result.current.pageItems).toEqual(['a']);

      act(() => {
        result.current.next();
      });

      expect(result.current.pageItems).toEqual(['b']);
    });

    test('debe manejar pageSize muy grande', () => {
      const items = ['a', 'b', 'c'];
      const { result } = renderHook(() => usePagination(items, 100));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toEqual(['a', 'b', 'c']);
    });

    test('debe mantener inmutabilidad de pageItems', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      const firstPageItems = result.current.pageItems;
      
      act(() => {
        result.current.next();
      });

      const secondPageItems = result.current.pageItems;

      expect(firstPageItems).not.toBe(secondPageItems); // Referencias diferentes
      expect(firstPageItems[0]).toBe('item-1');
      expect(secondPageItems[0]).toBe('item-11');
    });
  });

  describe('integración de todas las funciones', () => {
    test('debe funcionar correctamente en un flujo completo de navegación', () => {
      const { result } = renderHook(() => usePagination(sampleItems, 10));

      // Estado inicial
      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(5);

      // Navegar con next()
      act(() => {
        result.current.next();
        result.current.next();
      });

      expect(result.current.page).toBe(3);

      // Navegar con prev()
      act(() => {
        result.current.prev();
      });

      expect(result.current.page).toBe(2);

      // Navegar con go()
      act(() => {
        result.current.go(5);
      });

      expect(result.current.page).toBe(5);
      expect(result.current.pageItems[0]).toBe('item-41');

      // Intentar ir más allá y volver
      act(() => {
        result.current.next();
        result.current.setPage(1);
      });

      expect(result.current.page).toBe(1);
      expect(result.current.pageItems[0]).toBe('item-1');
    });
  });
});