// LoginForm.tsx - Login form component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../../../shared/constants/routes';
import { Modal } from '../../../shared/components/ui/Modal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export function LoginForm() {
  const [username, setUsername] = useState('emilys'); // Credenciales de prueba de DummyJSON
  const [password, setPassword] = useState('emilyspass');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Usuario y contraseña no pueden estar vacíos');
      setShowErrorModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ username: username.trim(), password: password.trim() });
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      // Determinar tipo de error
      if (error instanceof Error && error.message.includes('fetch')) {
        setErrorMsg('Algo salió mal, inténtelo más tarde');
      } else {
        setErrorMsg('Las credenciales no son correctas');
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <a 
          href="#" 
          className="forgot-password-link"
          onClick={(e) => {
            e.preventDefault();
            setShowForgotPassword(true);
          }}
        >
          Olvidé Contraseña
        </a>

        <div className="auth-links">
          <span>¿No tienes una cuenta? </span>
          <a 
            href="#" 
            className="register-link"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.register);
            }}
          >
            Regístrate
          </a>
        </div>
      </form>

      {/* Modal de Error */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error de Autenticación"
      >
        <div className="error-message">{errorMsg}</div>
        <button 
          onClick={() => setShowErrorModal(false)}
          style={{ marginTop: '1rem' }}
        >
          Cerrar
        </button>
      </Modal>

      {/* Modal de Olvidé Contraseña */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
