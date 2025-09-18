// Simple.Login.test.tsx - Tests básicos pero completos para Login
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';

// Mock simple del servicio
const mockLoginService = vi.fn();
vi.mock('@/modules/auth/services/auth.service', () => ({
  loginService: mockLoginService,
}));

// Mock del navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Tests - Complete Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('LoginPage Component', () => {
    it('renders the login page correctly', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    it('has correct page structure', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const main = document.querySelector('.login-page');
      expect(main).toBeInTheDocument();

      const form = document.querySelector('.login-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('LoginForm Basic Functionality', () => {
    it('renders form elements', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/usuario/i)).toHaveValue('emilys');
      expect(screen.getByLabelText(/contraseña/i)).toHaveValue('emilyspass');
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('allows input changes', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.clear(usernameInput);
      await user.type(usernameInput, 'testuser');
      
      await user.clear(passwordInput);
      await user.type(passwordInput, 'testpass');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpass');
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
      });
    });

    it('validates whitespace inputs', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.clear(usernameInput);
      await user.type(usernameInput, '   ');
      
      await user.clear(passwordInput);
      await user.type(passwordInput, '   ');
      
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Success Flow', () => {
    it('handles successful login', async () => {
      const user = userEvent.setup();
      
      // Mock successful response
      mockLoginService.mockResolvedValue({
        id: 1,
        username: 'emilys',
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@test.com',
        accessToken: 'fake-token'
      });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
      });
    });

    it('shows loading state during login', async () => {
      const user = userEvent.setup();
      
      // Mock delayed response
      mockLoginService.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          id: 1,
          username: 'emilys',
          firstName: 'Emily',
          lastName: 'Johnson',
          email: 'emily@test.com',
          accessToken: 'fake-token'
        }), 100))
      );

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeDisabled();
    });
  });

  describe('Login Error Handling', () => {
    it('handles network errors', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('fetch error'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/algo salió mal, inténtelo más tarde/i)).toBeInTheDocument();
      });
    });

    it('handles authentication errors', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });
    });

    it('closes error modal', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/las credenciales no son correctas/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    it('navigates to register page', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const registerLink = screen.getByText(/regístrate/i);
      await user.click(registerLink);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('opens forgot password modal', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const forgotPasswordLink = screen.getByText(/olvidé contraseña/i);
      await user.click(forgotPasswordLink);

      await waitFor(() => {
        expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Accessibility', () => {
    it('has proper labels', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.tab();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Input Properties', () => {
    it('has correct input types', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('disables inputs during loading', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          id: 1,
          username: 'emilys',
          firstName: 'Emily',
          lastName: 'Johnson',
          email: 'emily@test.com',
          accessToken: 'fake-token'
        }), 100))
      );

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.click(submitButton);

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});