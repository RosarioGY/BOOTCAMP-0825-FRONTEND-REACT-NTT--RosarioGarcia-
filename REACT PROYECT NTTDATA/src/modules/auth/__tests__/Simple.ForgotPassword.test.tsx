// Simple.ForgotPassword.test.tsx - Tests básicos para ForgotPasswordModal
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordModal } from '@/modules/auth/components/ForgotPasswordModal';

describe('ForgotPasswordModal Tests', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('does not render when closed', () => {
      render(
        <ForgotPasswordModal 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.queryByText('Recuperar Contraseña')).not.toBeInTheDocument();
    });

    it('renders when open', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar enlace de recuperación/i })).toBeInTheDocument();
    });

    it('has correct input properties', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveAttribute('placeholder', 'ejemplo@correo.com');
    });
  });

  describe('User Interactions', () => {
    it('allows email input', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('closes modal when close button clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const closeButton = screen.getByText('×');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      await user.click(submitButton);

      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    });

    it('shows error for invalid email', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText('Por favor ingrese un email válido')).toBeInTheDocument();
    });

    it('accepts valid email', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'valid@example.com');
      await user.click(submitButton);

      // Should not show validation errors
      expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument();
      expect(screen.queryByText('Por favor ingrese un email válido')).not.toBeInTheDocument();
    });
  });

  describe('Success Flow', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows loading state', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /enviando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
      expect(emailInput).toBeDisabled();
    });

    it('shows success message after submission', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Advance timer to complete the mock API call
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('Email Enviado')).toBeInTheDocument();
      });

      expect(screen.getByText('Enviado correctamente')).toBeInTheDocument();
      expect(screen.getByText(/se ha enviado un enlace de recuperación/i)).toBeInTheDocument();
    });

    it('closes modal from success state', async () => {
      const user = userEvent.setup();
      
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('Email Enviado')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Reset', () => {
    it('resets form when modal is closed and reopened', () => {
      const { rerender } = render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      // Close modal
      rerender(
        <ForgotPasswordModal 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      );

      // Reopen modal
      rerender(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      // Form should be reset
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('');
      expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument();
    });
  });
});