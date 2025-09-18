// LoginPage.tsx - Login page component
import { LoginForm } from '@/modules/auth/components/LoginForm';

export function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-form">
        <h1 className="login-title">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </main>
  );
}
