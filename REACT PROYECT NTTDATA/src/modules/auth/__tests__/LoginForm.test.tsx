// LoginForm.test.tsx - LoginForm component tests
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { AuthProvider } from '../context/AuthProvider';

// Mock del servicio de auth
vi.mock('../services/auth.service', () => ({
  loginService: vi.fn(),
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginForm', () => {
  it('should render login form fields', () => {
    render(
      <MockWrapper>
        <LoginForm />
      </MockWrapper>
    );

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    render(
      <MockWrapper>
        <LoginForm />
      </MockWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/usuario y contraseña no pueden estar vacíos/i)).toBeInTheDocument();
    });
  });

  it('should update input values when typing', () => {
    render(
      <MockWrapper>
        <LoginForm />
      </MockWrapper>
    );

    const usernameInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(usernameInput, { target: { value: 'test-user' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password' } });

    expect(usernameInput).toHaveValue('test-user');
    expect(passwordInput).toHaveValue('test-password');
  });
});