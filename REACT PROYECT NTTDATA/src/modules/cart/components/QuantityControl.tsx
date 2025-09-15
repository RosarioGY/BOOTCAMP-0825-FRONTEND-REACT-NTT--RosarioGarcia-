type Props = { qty: number; onInc: () => void; onDec: () => void; disabledInc?: boolean; };
export default function QuantityControl({ qty, onInc, onDec, disabledInc }: Props) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button onClick={onDec} aria-label="Disminuir" style={{ width: 28 }}>−</button>
      <input value={qty} readOnly style={{ width: 40, textAlign: 'center' }} />
      <button onClick={onInc} aria-label="Incrementar" style={{ width: 28 }} disabled={disabledInc}>＋</button>
    </div>
  );
}
