// usePagination.test.ts - Tests for usePagination Hook
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/modules/home/hooks/usePagination';

describe('usePagination Hook', () => {
  const mockItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  const smallItems = ['Item 1', 'Item 2', 'Item 3'];

  describe('inicialización por defecto', () => {
    it('debe inicializar con valores por defecto correctos', () => {
      const { result } = renderHook(() => usePagination(mockItems));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(Math.ceil(50 / 12)); // 5 páginas
      expect(result.current.pageItems).toHaveLength(12);
      expect(result.current.pageItems[0]).toBe('Item 1');
      expect(result.current.pageItems[11]).toBe('Item 12');
    });

    it('debe usar pageSize personalizado', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      expect(result.current.totalPages).toBe(5); // 50 / 10
      expect(result.current.pageItems).toHaveLength(10);
      expect(result.current.pageItems[0]).toBe('Item 1');
      expect(result.current.pageItems[9]).toBe('Item 10');
    });
  });

  describe('navegación con next/prev', () => {
    it('debe avanzar a la página siguiente con next()', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      act(() => {
        result.current.next();
      });

      expect(result.current.page).toBe(2);
      expect(result.current.pageItems[0]).toBe('Item 11');
      expect(result.current.pageItems[9]).toBe('Item 20');
    });

    it('no debe avanzar más allá de la última página con next()', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      // Ir a la última página
      act(() => {
        result.current.setPage(5);
      });

      expect(result.current.page).toBe(5);

      // Intentar avanzar más allá
      act(() => {
        result.current.next();
      });

      expect(result.current.page).toBe(5); // No debe cambiar
    });

    it('debe retroceder a la página anterior con prev()', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      // Ir a página 3
      act(() => {
        result.current.setPage(3);
      });

      act(() => {
        result.current.prev();
      });

      expect(result.current.page).toBe(2);
      expect(result.current.pageItems[0]).toBe('Item 11');
    });

    it('no debe retroceder más allá de la primera página con prev()', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      expect(result.current.page).toBe(1);

      act(() => {
        result.current.prev();
      });

      expect(result.current.page).toBe(1); // No debe cambiar
    });
  });

  describe('navegación directa con go()', () => {
    it('debe ir a la página especificada con go()', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      act(() => {
        result.current.go(3);
      });

      expect(result.current.page).toBe(3);
      expect(result.current.pageItems[0]).toBe('Item 21');
      expect(result.current.pageItems[9]).toBe('Item 30');
    });

    it('debe limitar go() a la página mínima (1)', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      act(() => {
        result.current.go(-5);
      });

      expect(result.current.page).toBe(1);
    });

    it('debe limitar go() a la página máxima', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      act(() => {
        result.current.go(100);
      });

      expect(result.current.page).toBe(5); // Máxima página para 50 items con pageSize 10
    });
  });

  describe('setPage directo', () => {
    it('debe permitir cambiar página directamente con setPage', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      act(() => {
        result.current.setPage(4);
      });

      expect(result.current.page).toBe(4);
      expect(result.current.pageItems[0]).toBe('Item 31');
      expect(result.current.pageItems[9]).toBe('Item 40');
    });
  });

  describe('manejo de diferentes tamaños de datos', () => {
    it('debe manejar lista vacía correctamente', () => {
      const { result } = renderHook(() => usePagination([], 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toHaveLength(0);
    });

    it('debe manejar lista con menos elementos que pageSize', () => {
      const { result } = renderHook(() => usePagination(smallItems, 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toHaveLength(3);
      expect(result.current.pageItems).toEqual(smallItems);
    });

    it('debe manejar lista con exactamente pageSize elementos', () => {
      const exactItems = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
      const { result } = renderHook(() => usePagination(exactItems, 10));

      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toHaveLength(10);
    });

    it('debe manejar lista que no divide exactamente por pageSize', () => {
      const oddItems = Array.from({ length: 23 }, (_, i) => `Item ${i + 1}`);
      const { result } = renderHook(() => usePagination(oddItems, 10));

      expect(result.current.totalPages).toBe(3); // Math.ceil(23/10)

      // Ir a la última página
      act(() => {
        result.current.setPage(3);
      });

      expect(result.current.pageItems).toHaveLength(3); // Solo 3 items en la última página
      expect(result.current.pageItems[0]).toBe('Item 21');
      expect(result.current.pageItems[2]).toBe('Item 23');
    });
  });

  describe('reactividad a cambios en items', () => {
    it('debe recalcular cuando cambian los items', () => {
      let items = mockItems.slice(0, 20); // 20 items iniciales
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      expect(result.current.totalPages).toBe(2);

      // Cambiar items
      items = mockItems.slice(0, 35); // 35 items ahora
      rerender({ items });

      expect(result.current.totalPages).toBe(4); // Math.ceil(35/10)
    });

    it('debe recalcular totalPages cuando cambian los items', () => {
      let items = mockItems; // 50 items = 5 páginas
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      // Ir a la página 4
      act(() => {
        result.current.setPage(4);
      });

      expect(result.current.page).toBe(4);

      // Reducir items a solo 15 (2 páginas)
      items = mockItems.slice(0, 15);
      rerender({ items });

      expect(result.current.totalPages).toBe(2);
      // La página actual permanece en 4, el hook no ajusta automáticamente
      // Esto es un comportamiento esperado ya que no implementa auto-ajuste
      expect(result.current.page).toBe(4);
    });
  });

  describe('casos edge y comportamientos especiales', () => {
    it('debe manejar pageSize de 1', () => {
      const { result } = renderHook(() => usePagination(smallItems, 1));

      expect(result.current.totalPages).toBe(3);
      expect(result.current.pageItems).toHaveLength(1);
      expect(result.current.pageItems[0]).toBe('Item 1');

      act(() => {
        result.current.next();
      });

      expect(result.current.pageItems[0]).toBe('Item 2');
    });

    it('debe manejar pageSize muy grande', () => {
      const { result } = renderHook(() => usePagination(mockItems, 1000));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.pageItems).toHaveLength(50);
      expect(result.current.pageItems).toEqual(mockItems);
    });

    it('debe mantener inmutabilidad de pageItems', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      const firstPageItems = result.current.pageItems;

      act(() => {
        result.current.next();
      });

      const secondPageItems = result.current.pageItems;

      // Los arrays deben ser diferentes instancias
      expect(firstPageItems).not.toBe(secondPageItems);
    });
  });

  describe('integración de todas las funciones', () => {
    it('debe funcionar correctamente en un flujo completo de navegación', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      // Navegar usando diferentes métodos
      act(() => {
        result.current.next(); // Página 2
      });
      expect(result.current.page).toBe(2);

      act(() => {
        result.current.go(4); // Página 4
      });
      expect(result.current.page).toBe(4);

      act(() => {
        result.current.prev(); // Página 3
      });
      expect(result.current.page).toBe(3);

      act(() => {
        result.current.setPage(1); // Página 1
      });
      expect(result.current.page).toBe(1);

      // Verificar que los pageItems son correctos
      expect(result.current.pageItems[0]).toBe('Item 1');
      expect(result.current.pageItems[9]).toBe('Item 10');
    });
  });

  describe('funciones devueltas', () => {
    it('debe devolver todas las funciones necesarias', () => {
      const { result } = renderHook(() => usePagination(mockItems));

      expect(typeof result.current.next).toBe('function');
      expect(typeof result.current.prev).toBe('function');
      expect(typeof result.current.go).toBe('function');
      expect(typeof result.current.setPage).toBe('function');
      expect(typeof result.current.page).toBe('number');
      expect(typeof result.current.totalPages).toBe('number');
      expect(Array.isArray(result.current.pageItems)).toBe(true);
    });
  });

  describe('performance y memoización', () => {
    it('debe memoizar pageItems correctamente', () => {
      const { result, rerender } = renderHook(() => usePagination(mockItems, 10));

      const firstPageItems = result.current.pageItems;

      // Re-render sin cambios
      rerender();

      const secondPageItems = result.current.pageItems;

      // Debe ser la misma referencia debido a useMemo
      expect(firstPageItems).toBe(secondPageItems);
    });

    it('debe recalcular pageItems cuando cambia la página', () => {
      const { result } = renderHook(() => usePagination(mockItems, 10));

      const firstPageItems = result.current.pageItems;

      act(() => {
        result.current.next();
      });

      const secondPageItems = result.current.pageItems;

      // Debe ser diferente referencia cuando cambia la página
      expect(firstPageItems).not.toBe(secondPageItems);
    });
  });
});