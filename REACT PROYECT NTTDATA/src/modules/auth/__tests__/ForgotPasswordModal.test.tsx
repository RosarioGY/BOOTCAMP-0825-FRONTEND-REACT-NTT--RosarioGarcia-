// ForgotPasswordModal.test.tsx - Tests para ForgotPasswordModal
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordModal } from '@/modules/auth/components/ForgotPasswordModal';

describe('ForgotPasswordModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('should not render when isOpen is false', () => {
      render(
        <ForgotPasswordModal 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.queryByText('Recuperar Contraseña')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument(); // Botón de cerrar
    });

    it('should render form elements correctly', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar enlace de recuperación/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('ejemplo@correo.com')).toBeInTheDocument();
    });

    it('should have correct input attributes', () => {
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
    });
  });

  describe('Interacciones de usuario', () => {
    it('should update email input value when typing', async () => {
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

    it('should call onClose when modal close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      // El Modal tiene un botón de cerrar (×)
      const closeButton = screen.getByText('×');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validación de formulario', () => {
    it('should show error for empty email', async () => {
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

    it('should show error for whitespace-only email', async () => {
      const user = userEvent.setup();
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, '   ');
      await user.click(submitButton);

      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    });

    it('should show error for invalid email format', async () => {
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

    it('should validate various invalid email formats', async () => {
      const user = userEvent.setup();
      const invalidEmails = [
        'test@',
        '@example.com',
        'test.example.com',
        'test@.com',
        'test@example',
        'test space@example.com'
      ];

      for (const email of invalidEmails) {
        render(
          <ForgotPasswordModal 
            isOpen={true} 
            onClose={mockOnClose} 
          />
        );

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.click(submitButton);

        expect(screen.getByText('Por favor ingrese un email válido')).toBeInTheDocument();
      }
    });

    it('should accept valid email formats', async () => {
      const user = userEvent.setup();
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test123@example-site.org'
      ];

      for (const email of validEmails) {
        render(
          <ForgotPasswordModal 
            isOpen={true} 
            onClose={mockOnClose} 
          />
        );

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

        await user.type(emailInput, email);
        await user.click(submitButton);

        // No debe mostrar error de validación
        expect(screen.queryByText('Por favor ingrese un email válido')).not.toBeInTheDocument();
        expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument();
      }
    });
  });

  describe('Estados de envío', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show loading state during submission', async () => {
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

    it('should show success state after successful submission', async () => {
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

      // Avanzar el tiempo para completar la simulación
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('Email Enviado')).toBeInTheDocument();
      });

      expect(screen.getByText('Enviado correctamente')).toBeInTheDocument();
      expect(screen.getByText(/se ha enviado un enlace de recuperación/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
    });

    it('should close modal and reset state when close button is clicked in success state', async () => {
      const user = userEvent.setup();
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      // Enviar el formulario
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Avanzar el tiempo para completar la simulación
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('Email Enviado')).toBeInTheDocument();
      });

      // Hacer clic en cerrar
      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Limpieza de estado', () => {
    it('should reset form state when modal is closed', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      // Llenar el formulario y generar error
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText('Por favor ingrese un email válido')).toBeInTheDocument();

      // Cerrar y reabrir modal
      rerender(
        <ForgotPasswordModal 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      );

      rerender(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      // Verificar que el estado se reseteo
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('');
      expect(screen.queryByText('Por favor ingrese un email válido')).not.toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('should have proper form structure', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should have properly associated labels', () => {
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      expect(emailInput).toHaveAccessibleName('Correo electrónico:');
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <ForgotPasswordModal 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});