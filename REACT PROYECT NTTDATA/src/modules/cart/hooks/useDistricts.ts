import { useEffect, useState } from 'react';

// Lee JSON local (requisito: custom hook desde un archivo JSON)
type DistrictsFile = { districts: string[] };

export function useDistricts() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // import dinámico soportado por Vite/TS
        const mod: DistrictsFile = (await import('../../../assets/data/districts.json')).default as DistrictsFile;
        if (mounted) setDistricts(mod.districts ?? []);
      } catch {
        if (mounted) setErr('No se pudieron cargar los distritos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { districts, loading, err };
}
