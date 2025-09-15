// RegisterForm.tsx - Register form component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/modules/auth/hooks/useRegister';
import { ROUTES } from '@/shared/constants/routes';
import { Modal } from '@/shared/components/ui/Modal';
import { Alert } from '@/shared/components/ui/Alert';
import type { RegisterCredentials } from '@/modules/auth/types/auth.types';

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    age: 18,
    gender: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { register, isLoading, error, reset } = useRegister();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'age') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): string | null => {
    // Validaciones básicas
    if (!formData.firstName.trim()) return 'El nombre es requerido';
    if (!formData.lastName.trim()) return 'El apellido es requerido';
    if (!formData.username.trim()) return 'El nombre de usuario es requerido';
    if (!formData.email.trim()) return 'El email es requerido';
    if (!formData.password.trim()) return 'La contraseña es requerida';
    if (formData.age < 13) return 'Debes tener al menos 13 años';
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Por favor ingresa un email válido';
    }
    
    // Validación de contraseña
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (formData.password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      return;
    }
    
    try {
      await register(formData);
      setShowSuccessModal(true);
    } catch (error) {
      // El error ya se maneja en el hook useRegister
      console.error('Error durante el registro:', error);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    reset();
    navigate(ROUTES.login);
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.login);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Nombre *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Ingresa tu nombre"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Ingresa tu apellido"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de usuario *</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            placeholder="Elige un nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Edad *</label>
            <input
              id="age"
              name="age"
              type="number"
              min="13"
              max="120"
              value={formData.age}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Género</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="">Seleccionar...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Confirma tu contraseña"
          />
        </div>

        {error && (
          <Alert type="error" message={error} />
        )}

        <button type="submit" disabled={isLoading} className="register-button">
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <div className="auth-links">
          <span>¿Ya tienes una cuenta? </span>
          <button 
            type="button"
            onClick={handleGoToLogin}
            className="link-button"
            disabled={isLoading}
          >
            Inicia sesión
          </button>
        </div>
      </form>

      {/* Modal de Éxito */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="¡Registro exitoso!"
      >
        <div className="success-message">
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p>Ahora puedes iniciar sesión con tus credenciales.</p>
        </div>
        <button 
          onClick={handleSuccessModalClose}
          style={{ marginTop: '1rem' }}
          className="primary-button"
        >
          Ir al Login
        </button>
      </Modal>
    </>
  );
}