// RegisterForm.test.tsx - Unit tests for RegisterForm component
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { useRegister } from '@/modules/auth/hooks/useRegister';
import { ROUTES } from '@/shared/constants/routes';

// Mock dependencies
jest.mock('@/modules/auth/hooks/useRegister');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;
const mockNavigate = jest.fn();

// Mock react-router-dom useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterForm Component', () => {
  const mockRegister = jest.fn();
  const mockReset = jest.fn();

  const defaultRegisterMock = {
    register: mockRegister,
    isLoading: false,
    error: null,
    isSuccess: false,
    reset: mockReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue(defaultRegisterMock);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText(/nombre \*/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/apellido \*/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/nombre de usuario \*/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email \*/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/edad \*/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/género/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByPlaceholderText(/mínimo 6 caracteres/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/confirma tu contraseña/i), { target: { value: 'password123' } });
  };

  describe('Rendering', () => {
    it('should render registration form with all required fields', () => {
      renderWithRouter(<RegisterForm />);

      expect(screen.getByLabelText(/nombre \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre de usuario \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/edad \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    it('should have correct input types and attributes', () => {
      renderWithRouter(<RegisterForm />);

      expect(screen.getByLabelText(/email \*/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/edad \*/i)).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText(/edad \*/i)).toHaveAttribute('min', '13');
      expect(screen.getByLabelText(/edad \*/i)).toHaveAttribute('max', '120');
      expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toHaveAttribute('type', 'password');
      expect(screen.getByPlaceholderText('Confirma tu contraseña')).toHaveAttribute('type', 'password');
    });

    it('should have gender select with correct options', () => {
      renderWithRouter(<RegisterForm />);

      const genderSelect = screen.getByLabelText(/género/i);
      expect(genderSelect).toBeInTheDocument();
      
      expect(screen.getByRole('option', { name: /seleccionar\.\.\./i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /masculino/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /femenino/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /otro/i })).toBeInTheDocument();
    });

    it('should initialize age field with default value 18', () => {
      renderWithRouter(<RegisterForm />);

      const ageInput = screen.getByLabelText(/edad \*/i) as HTMLInputElement;
      expect(ageInput.value).toBe('18');
    });

    it('should show login link', () => {
      renderWithRouter(<RegisterForm />);

      expect(screen.getByText(/¿ya tienes una cuenta\?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /inicia sesión/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate required firstName field', async () => {
      renderWithRouter(<RegisterForm />);
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      // Since we're testing validation that happens before the hook is called
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      fireEvent.change(screen.getByLabelText(/email \*/i), { target: { value: 'invalid-email' } });
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate password length', async () => {
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: '123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate password confirmation', async () => {
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      fireEvent.change(screen.getByLabelText(/confirmar contraseña \*/i), { target: { value: 'different' } });
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should validate minimum age', async () => {
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      fireEvent.change(screen.getByLabelText(/edad \*/i), { target: { value: '12' } });
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should accept valid form data', async () => {
      mockRegister.mockResolvedValue(undefined);
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          age: 25,
          gender: 'male',
        });
      });
    });
  });

  describe('Form Interaction', () => {
    it('should update form fields when typing', () => {
      renderWithRouter(<RegisterForm />);

      const firstNameInput = screen.getByLabelText(/nombre \*/i) as HTMLInputElement;
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput.value).toBe('John');

      const emailInput = screen.getByLabelText(/email \*/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      expect(emailInput.value).toBe('john@test.com');
    });

    it('should handle age as number input', () => {
      renderWithRouter(<RegisterForm />);

      const ageInput = screen.getByLabelText(/edad \*/i) as HTMLInputElement;
      fireEvent.change(ageInput, { target: { value: '30' } });
      expect(ageInput.value).toBe('30');
    });

    it('should handle gender selection', () => {
      renderWithRouter(<RegisterForm />);

      const genderSelect = screen.getByLabelText(/género/i) as HTMLSelectElement;
      fireEvent.change(genderSelect, { target: { value: 'female' } });
      expect(genderSelect.value).toBe('female');
    });

    it('should handle confirm password separately', () => {
      renderWithRouter(<RegisterForm />);

      const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña \*/i) as HTMLInputElement;
      fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
      expect(confirmPasswordInput.value).toBe('test123');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during registration', () => {
      mockUseRegister.mockReturnValue({
        ...defaultRegisterMock,
        isLoading: true,
      });

      renderWithRouter(<RegisterForm />);

      expect(screen.getByRole('button', { name: /registrando\.\.\./i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrando\.\.\./i })).toBeDisabled();
    });

    it('should disable all inputs during loading', () => {
      mockUseRegister.mockReturnValue({
        ...defaultRegisterMock,
        isLoading: true,
      });

      renderWithRouter(<RegisterForm />);

      expect(screen.getByLabelText(/nombre \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/apellido \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/nombre de usuario \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/email \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/edad \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/género/i)).toBeDisabled();
      expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeDisabled();
      expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when registration fails', () => {
      const errorMessage = 'Registration failed';
      mockUseRegister.mockReturnValue({
        ...defaultRegisterMock,
        error: errorMessage,
      });

      renderWithRouter(<RegisterForm />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display error message when no error', () => {
      renderWithRouter(<RegisterForm />);

      // Check that no alert is present
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Success Modal', () => {
    it('should show success modal after successful registration', async () => {
      mockRegister.mockResolvedValue(undefined);
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/¡registro exitoso!/i)).toBeInTheDocument();
        expect(screen.getByText(/tu cuenta ha sido creada exitosamente/i)).toBeInTheDocument();
      });
    });

    it('should navigate to login when success modal is closed', async () => {
      mockRegister.mockResolvedValue(undefined);
      renderWithRouter(<RegisterForm />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/¡registro exitoso!/i)).toBeInTheDocument();
      });

      const modalButton = screen.getByRole('button', { name: /ir al login/i });
      fireEvent.click(modalButton);

      expect(mockReset).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.login);
    });
  });

  describe('Navigation', () => {
    it('should navigate to login when login link is clicked', () => {
      renderWithRouter(<RegisterForm />);

      const loginButton = screen.getByRole('button', { name: /inicia sesión/i });
      fireEvent.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.login);
    });

    it('should not allow navigation during loading', () => {
      mockUseRegister.mockReturnValue({
        ...defaultRegisterMock,
        isLoading: true,
      });

      renderWithRouter(<RegisterForm />);

      const loginButton = screen.getByRole('button', { name: /inicia sesión/i });
      expect(loginButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      renderWithRouter(<RegisterForm />);

      expect(screen.getByLabelText(/nombre \*/i)).toBeRequired();
      expect(screen.getByLabelText(/apellido \*/i)).toBeRequired();
      expect(screen.getByLabelText(/nombre de usuario \*/i)).toBeRequired();
      expect(screen.getByLabelText(/email \*/i)).toBeRequired();
      expect(screen.getByLabelText(/edad \*/i)).toBeRequired();
      expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeRequired();
      expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeRequired();
    });

    it('should have proper form role', () => {
      renderWithRouter(<RegisterForm />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-numeric age input', () => {
      renderWithRouter(<RegisterForm />);

      const ageInput = screen.getByLabelText(/edad \*/i) as HTMLInputElement;
      fireEvent.change(ageInput, { target: { value: 'abc' } });
      
      // Should set age to 0 for non-numeric input
      expect(ageInput.value).toBe('0');
    });

    it('should trim whitespace from text inputs', async () => {
      mockRegister.mockResolvedValue(undefined);
      renderWithRouter(<RegisterForm />);
      
      fireEvent.change(screen.getByLabelText(/nombre \*/i), { target: { value: '  John  ' } });
      fireEvent.change(screen.getByLabelText(/apellido \*/i), { target: { value: '  Doe  ' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario \*/i), { target: { value: '  johndoe  ' } });
      fireEvent.change(screen.getByLabelText(/email \*/i), { target: { value: '  john@example.com  ' } });
      fireEvent.change(screen.getByLabelText(/edad \*/i), { target: { value: '25' } });
      fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: '  password123  ' } });
      fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), { target: { value: '  password123  ' } });
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Form should trim whitespace from text inputs before submission
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe', 
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        age: 25,
        gender: '',
      });
    });

    it('should handle registration error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockRegister.mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<RegisterForm />);
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error durante el registro:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });
});