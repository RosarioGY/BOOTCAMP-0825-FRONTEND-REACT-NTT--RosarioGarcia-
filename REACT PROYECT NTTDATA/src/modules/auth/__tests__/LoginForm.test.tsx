// LoginForm.test.tsx - Unit tests for LoginForm component
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';

// Mock dependencies
jest.mock('@/modules/auth/hooks/useAuth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockNavigate = jest.fn();

// Mock react-router-dom useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginForm Component', () => {
  const mockLogin = jest.fn();

  const defaultAuthMock = {
    login: mockLogin,
    logout: jest.fn(),
    user: null,
    isAuthenticated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuthMock);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render login form with all required elements', () => {
      renderWithRouter(<LoginForm />);

      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByText(/olvidé contraseña/i)).toBeInTheDocument();
      expect(screen.getByText(/regístrate/i)).toBeInTheDocument();
    });

    it('should render input fields with default test credentials', () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;

      expect(usernameInput.value).toBe('emilys');
      expect(passwordInput.value).toBe('emilyspass');
    });

    it('should render password input as password type', () => {
      renderWithRouter(<LoginForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Interaction', () => {
    it('should update username input value on change', () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i) as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });

      expect(usernameInput.value).toBe('newuser');
    });

    it('should update password input value on change', () => {
      renderWithRouter(<LoginForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'newpass' } });

      expect(passwordInput.value).toBe('newpass');
    });

    it('should show error modal when username is empty', async () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(usernameInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Wait for modal to appear and check both title and error message
      await waitFor(() => {
        expect(screen.getByText(/error de autenticación/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
    });

    it('should show error modal when password is empty', async () => {
      renderWithRouter(<LoginForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Wait for modal to appear and check both title and error message
      await waitFor(() => {
        expect(screen.getByText(/error de autenticación/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
    });

    it('should trim whitespace from inputs', async () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(usernameInput, { target: { value: '  testuser  ' } });
      fireEvent.change(passwordInput, { target: { value: '  testpass  ' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'testpass',
        });
      });
    });
  });

  describe('Form Submission', () => {
    it('should call login and navigate on successful submission', async () => {
      mockLogin.mockResolvedValue(undefined);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'emilys',
          password: 'emilyspass',
        });
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.home, { replace: true });
      });
    });

    it('should show loading state during submission', async () => {
      const mockLoginPromise = new Promise(resolve => setTimeout(resolve, 100));
      mockLogin.mockReturnValue(mockLoginPromise);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/iniciando sesión\.\.\./i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => mockLoginPromise);
    });

    it('should show network error message for fetch errors', async () => {
      const fetchError = new Error('fetch failed');
      mockLogin.mockRejectedValue(fetchError);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/algo salió mal, inténtelo más tarde/i)).toBeInTheDocument();
      });
    });

    it('should show credential error message for authentication errors', async () => {
      const authError = new Error('Invalid credentials');
      mockLogin.mockRejectedValue(authError);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });
    });

    it('should re-enable form after error', async () => {
      const authError = new Error('Invalid credentials');
      mockLogin.mockRejectedValue(authError);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/iniciar sesión/i);
    });
  });

  describe('Modal Interactions', () => {
    it('should open forgot password modal when link is clicked', () => {
      renderWithRouter(<LoginForm />);

      const forgotPasswordLink = screen.getByText(/olvidé contraseña/i);
      fireEvent.click(forgotPasswordLink);

      // Check if ForgotPasswordModal is rendered
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close error modal when close button is clicked', async () => {
      renderWithRouter(<LoginForm />);

      // Trigger error modal
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      const usernameInput = screen.getByLabelText(/usuario/i);
      fireEvent.change(usernameInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Wait for modal to appear first
      await waitFor(() => {
        expect(screen.getByText(/error de autenticación/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();

      // Close modal - now we can find the button by its accessible name
      const closeButton = screen.getByRole('button', { name: /cerrar modal de error/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/usuario y contraseña no pueden estar vacíos/i)).not.toBeInTheDocument();
      });
    });

    it('should close forgot password modal', async () => {
      renderWithRouter(<LoginForm />);

      // Open forgot password modal
      const forgotPasswordLink = screen.getByText(/olvidé contraseña/i);
      fireEvent.click(forgotPasswordLink);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close modal - use the × button which is the standard modal close button
      const closeButton = screen.getByRole('button', { name: '×' });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should render register link', () => {
      renderWithRouter(<LoginForm />);

      const registerLink = screen.getByText(/regístrate/i);
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '#');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      // Fields use custom validation instead of HTML5 required attribute
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('should handle form submission when already loading', async () => {
      const mockLoginPromise = new Promise(() => {}); // Never resolves
      mockLogin.mockReturnValue(mockLoginPromise);
      renderWithRouter(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // First click
      fireEvent.click(submitButton);
      expect(screen.getByText(/iniciando sesión\.\.\./i)).toBeInTheDocument();
      
      // Second click should be ignored
      fireEvent.click(submitButton);
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it('should prevent form submission with only whitespace', async () => {
      renderWithRouter(<LoginForm />);

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(usernameInput, { target: { value: '   ' } });
      fireEvent.change(passwordInput, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});