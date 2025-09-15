// Input.tsx - Input UI component
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, ...rest }, ref) => (
  <label style={{ display: 'block', marginBottom: 12 }}>
    {label && <span style={{ display: 'block', marginBottom: 4 }}>{label}</span>}
    <input ref={ref} {...rest} style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }} />
    {error && <small style={{ color: 'crimson' }}>{error}</small>}
  </label>
));
