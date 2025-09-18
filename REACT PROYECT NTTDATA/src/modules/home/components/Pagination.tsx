type Props = {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7); // compacto

  return (
    <nav className="pager">
      <button 
        className="pager-nav" 
        onClick={() => onChange(page - 1)} 
        disabled={page === 1}
      >
        ← Anterior
      </button>
      
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`pager-page ${p === page ? 'is-active' : ''}`}
        >
          Página {p}
        </button>
      ))}
      
      <button 
        className="pager-nav"
        onClick={() => onChange(page + 1)} 
        disabled={page === totalPages}
      >
        Siguiente →
      </button>
    </nav>
  );
}
