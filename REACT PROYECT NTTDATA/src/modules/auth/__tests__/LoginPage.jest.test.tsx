// LoginPage.jest.test.tsx - Tests con Jest para LoginPage
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';

// Mock del servicio de auth
jest.mock('@/modules/auth/services/auth.service', () => ({
  loginService: jest.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage - Jest Tests', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar la página de login correctamente', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    test('debe tener la estructura HTML correcta', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const main = document.querySelector('.login-page');
      expect(main).toBeInTheDocument();

      const formContainer = document.querySelector('.login-form');
      expect(formContainer).toBeInTheDocument();

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Iniciar sesión');
      expect(title).toHaveClass('login-title');
    });

    test('debe renderizar el componente LoginForm', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      // Verificar elementos del LoginForm
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByText(/olvidé contraseña/i)).toBeInTheDocument();
      expect(screen.getByText(/regístrate/i)).toBeInTheDocument();
    });
  });

  describe('Estructura de clases CSS', () => {
    test('debe aplicar las clases CSS correctas', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const mainElement = document.querySelector('.login-page');
      const formContainer = document.querySelector('.login-form');
      const title = screen.getByRole('heading', { level: 1 });

      expect(mainElement).toHaveClass('login-page');
      expect(formContainer).toHaveClass('login-form');
      expect(title).toHaveClass('login-title');
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener estructura semántica correcta', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });

    test('debe tener labels asociados correctamente', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });
});