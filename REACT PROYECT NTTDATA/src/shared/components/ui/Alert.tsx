// Alert.tsx - Alert UI component


interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const getAlertClass = () => {
    switch (type) {
      case 'error':
        return 'alert alert-error';
      case 'success':
        return 'alert alert-success';
      case 'warning':
        return 'alert alert-warning';
      case 'info':
        return 'alert alert-info';
      default:
        return 'alert';
    }
  };

  return (
    <div className={getAlertClass()}>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="alert-close"
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}