// LoginPage.test.tsx - Tests completos para LoginPage
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';

// Mock del servicio de auth
vi.mock('@/modules/auth/services/auth.service', () => ({
  loginService: vi.fn(),
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  describe('Renderizado y estructura', () => {
    it('should render the main login page container', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass('login-page');
    });

    it('should render the login form container', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      const formContainer = screen.getByRole('main').querySelector('.login-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('should render the page title "Iniciar sesión"', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Iniciar sesión');
      expect(title).toHaveClass('login-title');
    });

    it('should render the LoginForm component', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      // Verificar que los elementos del LoginForm están presentes
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  describe('Estilos CSS aplicados', () => {
    it('should apply correct CSS classes to page structure', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      const mainElement = screen.getByRole('main');
      const formContainer = mainElement.querySelector('.login-form');
      const title = screen.getByRole('heading', { level: 1 });

      expect(mainElement).toHaveClass('login-page');
      expect(formContainer).toHaveClass('login-form');
      expect(title).toHaveClass('login-title');
    });
  });

  describe('Accesibilidad', () => {
    it('should have proper semantic HTML structure', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      // Verificar estructura semántica
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should have accessible form labels', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      // Verificar que los labels están correctamente asociados
      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });

  describe('Integración con LoginForm', () => {
    it('should render all LoginForm elements correctly', () => {
      render(
        <MockWrapper>
          <LoginPage />
        </MockWrapper>
      );

      // Verificar elementos del form
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      
      // Verificar enlaces adicionales
      expect(screen.getByText(/olvidé contraseña/i)).toBeInTheDocument();
      expect(screen.getByText(/¿no tienes una cuenta\?/i)).toBeInTheDocument();
      expect(screen.getByText(/regístrate/i)).toBeInTheDocument();
    });
  });
});