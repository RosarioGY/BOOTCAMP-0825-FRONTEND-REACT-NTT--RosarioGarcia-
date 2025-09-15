// Button.tsx - Button UI component
import type { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #444', cursor: 'pointer' }} />
  );
}
