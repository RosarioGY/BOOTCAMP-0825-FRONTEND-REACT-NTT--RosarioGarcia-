export function CartTotal({ total }: { total: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
      <strong style={{ fontSize: 18 }}>Total: ${total.toFixed(2)}</strong>
    </div>
  );
}
