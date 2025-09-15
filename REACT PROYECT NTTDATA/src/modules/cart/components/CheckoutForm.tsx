import { useState } from 'react';
import DistrictSelect from '@/modules/cart/components/DistrictSelect';
import { isLetters, isNonEmpty, isPhone } from '@/shared/utils/validation';

export type CheckoutData = {
  nombres: string;
  apellidos: string;
  distrito: string;
  direccion: string;
  referencia: string;
  celular: string;
};

type Props = {
  disabled?: boolean;
  onSuccess: (data: CheckoutData) => void;
};

export default function CheckoutForm({ disabled, onSuccess }: Props) {
  const [data, setData] = useState<CheckoutData>({
    nombres: '', apellidos: '', distrito: '', direccion: '', referencia: '', celular: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  const set = (k: keyof CheckoutData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData(s => ({ ...s, [k]: e.target.value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!isNonEmpty(data.nombres) || !isLetters(data.nombres)) e.nombres = 'Debe ingresar un valor válido';
    if (!isNonEmpty(data.apellidos) || !isLetters(data.apellidos)) e.apellidos = 'Debe ingresar un valor válido';
    if (!isNonEmpty(data.distrito)) e.distrito = 'Campo obligatorio';
    if (!isNonEmpty(data.direccion)) e.direccion = 'Campo obligatorio';
    if (!isNonEmpty(data.referencia)) e.referencia = 'Campo obligatorio';
    if (!isNonEmpty(data.celular) || !isPhone(data.celular)) e.celular = 'Debe ingresar un valor válido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSuccess(data);
  };

  const input = (label: string, k: keyof CheckoutData, type = 'text') => (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: 4 }}>{label}</span>
      <input
        type={type}
        value={data[k]}
        onChange={set(k)}
        onBlur={() => validate()}
        style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
      />
      {errors[k] && <small style={{ color: 'crimson' }}>{errors[k]}</small>}
    </label>
  );

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <h3>Datos de envío</h3>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {input('Nombres', 'nombres')}
        {input('Apellidos', 'apellidos')}
        <DistrictSelect
          value={data.distrito}
          onChange={v => setData(s => ({ ...s, distrito: v }))}
          error={errors.distrito}
        />
        {input('Dirección', 'direccion')}
        {input('Referencia', 'referencia')}
        {input('Celular', 'celular', 'tel')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={disabled} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #334155' }}>
          Comprar
        </button>
      </div>
    </form>
  );
}
