type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
};
export default function SearchBox({ value, onChange, onClear }: Props) {
  const tooShort = value.trim().length > 0 && value.trim().length < 3;

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar productos… (mínimo 3 caracteres)"
        style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 10, border: '1px solid #cbd5e1' }}
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={onClear}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18
          }}
        >×</button>
      )}
      {tooShort && <small style={{ color: '#b91c1c' }}>mínimo son 3 caracteres</small>}
    </div>
  );
}
