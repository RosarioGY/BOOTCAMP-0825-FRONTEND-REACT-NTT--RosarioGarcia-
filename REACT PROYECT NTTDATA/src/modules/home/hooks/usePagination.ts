// usePagination.ts - Pagination custom hook 
import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 12) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const next = () => setPage(p => Math.min(p + 1, totalPages));
  const prev = () => setPage(p => Math.max(p - 1, 1));
  const go = (n: number) => setPage(Math.min(Math.max(n, 1), totalPages));

  return { page, totalPages, pageItems, next, prev, go, setPage };
}
