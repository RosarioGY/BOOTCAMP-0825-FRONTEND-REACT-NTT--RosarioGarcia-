import { useDistricts } from '@/modules/cart/hooks/useDistricts';

type Props = { value: string; onChange: (v: string) => void; error?: string; };
export default function DistrictSelect({ value, onChange, error }: Props) {
  const { districts, loading, err } = useDistricts();

  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ display: 'block', marginBottom: 4 }}>Distrito</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading || !!err}
        style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
      >
        <option value="">Seleccione…</option>
        {districts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      {(error || err) && <small style={{ color: 'crimson' }}>{error || err}</small>}
    </label>
  );
}
