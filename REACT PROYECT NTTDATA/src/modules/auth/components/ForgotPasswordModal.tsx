// ForgotPasswordModal.tsx - Forgot password modal component
import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);
    
    // Simular API call
    setTimeout(() => {
      // Use a ref to avoid updates if component is unmounted
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={isSubmitted ? "Email Enviado" : "Recuperar Contraseña"}
    >
      {isSubmitted ? (
        <div>
          <div className="success-message">
            Enviado correctamente
          </div>
          <p>Se ha enviado un enlace de recuperación a tu correo electrónico.</p>
          <button onClick={handleClose} style={{ marginTop: '1rem' }}>
            Cerrar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
      )}
    </Modal>
  );
}