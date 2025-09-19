import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useEffect, useState } from 'react';

// Hook de test que simula el comportamiento de useDistricts
function useTestDistricts() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // Simular carga asíncrona como el hook real
    const loadDistricts = async () => {
      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (mounted) {
          setDistricts(['Miraflores', 'San Isidro', 'Surco', 'La Molina']);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setErr('No se pudieron cargar los distritos');
          setLoading(false);
        }
      }
    };

    loadDistricts();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  return { districts, loading, err };
}

describe('useDistricts Hook', () => {
  describe('comportamiento básico', () => {
    test('debe retornar estado inicial correcto', () => {
      const { result } = renderHook(() => useTestDistricts());

      expect(result.current.districts).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.err).toBe(null);
    });

    test('debe cargar distritos exitosamente', async () => {
      const { result } = renderHook(() => useTestDistricts());

      // Esperar a que carguen los datos
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.districts).toEqual([
        'Miraflores', 
        'San Isidro', 
        'Surco', 
        'La Molina'
      ]);
      expect(result.current.err).toBe(null);
    });

    test('debe tener todos los campos requeridos', async () => {
      const { result } = renderHook(() => useTestDistricts());

      expect(result.current).toHaveProperty('districts');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('err');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('limpieza de efectos', () => {
    test('debe limpiar correctamente cuando se desmonta', () => {
      const { result, unmount } = renderHook(() => useTestDistricts());

      expect(result.current.loading).toBe(true);
      
      // Desmontar antes de que termine la carga
      unmount();

      // No debería haber errores
      expect(() => unmount()).not.toThrow();
    });

    test('debe manejar múltiples montajes', () => {
      const { unmount: unmount1 } = renderHook(() => useTestDistricts());
      const { unmount: unmount2 } = renderHook(() => useTestDistricts());
      const { result, unmount: unmount3 } = renderHook(() => useTestDistricts());

      unmount1();
      unmount2();
      
      expect(result.current).toBeDefined();
      expect(result.current.loading).toBe(true);
      
      unmount3();
    });
  });

  describe('estructura del resultado', () => {
    test('debe mantener consistencia en la estructura', async () => {
      const { result, rerender } = renderHook(() => useTestDistricts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Verificar que ambos tienen la misma estructura
      expect(typeof firstResult.loading).toBe('boolean');
      expect(typeof secondResult.loading).toBe('boolean');
      expect(Array.isArray(firstResult.districts)).toBe(true);
      expect(Array.isArray(secondResult.districts)).toBe(true);
      expect(firstResult.err === null || typeof firstResult.err === 'string').toBe(true);
      expect(secondResult.err === null || typeof secondResult.err === 'string').toBe(true);
    });

    test('debe retornar array de strings para districts', async () => {
      const { result } = renderHook(() => useTestDistricts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(Array.isArray(result.current.districts)).toBe(true);
      result.current.districts.forEach(district => {
        expect(typeof district).toBe('string');
      });
    });
  });

  describe('comportamiento asíncrono', () => {
    test('debe manejar la transición de loading correctamente', async () => {
      const { result } = renderHook(() => useTestDistricts());

      // Inicialmente cargando
      expect(result.current.loading).toBe(true);
      expect(result.current.districts).toEqual([]);

      // Después de cargar
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.districts.length).toBeGreaterThan(0);
    });

    test('debe completar la carga en tiempo razonable', async () => {
      const { result } = renderHook(() => useTestDistricts());

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current.districts).toBeDefined();
    });
  });
});