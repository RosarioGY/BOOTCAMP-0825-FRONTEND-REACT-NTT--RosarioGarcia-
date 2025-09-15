type Props = {
  categories: string[];
  selected: string | 'Todos';
  onSelect: (c: string | 'Todos') => void;
};

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const items = ['Todos' as const, ...categories];
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
      {items.map(cat => {
        const active = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: `1px solid ${active ? '#1d4ed8' : '#cbd5e1'}`,
              background: active ? '#dbeafe' : '#fff',
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
