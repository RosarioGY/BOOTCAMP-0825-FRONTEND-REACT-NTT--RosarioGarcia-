// LoginPage.tsx - Login page component
import { LoginForm } from '@/modules/auth/components/LoginForm';

export function LoginPage() {
  return (
    <main className="container">
      <h1>Iniciar sesión</h1>
      <LoginForm />
    </main>
  );
}
