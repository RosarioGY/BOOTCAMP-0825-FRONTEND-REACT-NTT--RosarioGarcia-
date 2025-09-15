// RegisterPage.tsx - Register page component
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <main className="container">
      <div className="register-page">
        <h1>Crear cuenta</h1>
        <p className="register-subtitle">
          Completa el formulario para crear tu nueva cuenta
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}