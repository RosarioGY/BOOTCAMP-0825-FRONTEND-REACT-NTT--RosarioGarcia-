type Props = {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7); // compacto

  return (
    <nav style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: `1px solid ${p === page ? '#1d4ed8' : '#cbd5e1'}`,
            background: p === page ? '#dbeafe' : '#fff',
            cursor: 'pointer'
          }}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}>›</button>
    </nav>
  );
}
