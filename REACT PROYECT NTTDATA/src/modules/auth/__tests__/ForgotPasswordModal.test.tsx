// ForgotPasswordModal.test.tsx - Unit tests for ForgotPasswordModal component
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ForgotPasswordModal } from '@/modules/auth/components/ForgotPasswordModal';

// Mock dependencies
jest.mock('@/shared/components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
    isOpen ? (
      <div role="dialog" aria-labelledby="modal-title">
        <h2 id="modal-title">{title}</h2>
        <button onClick={onClose} aria-label="Cerrar">×</button>
        {children}
      </div>
    ) : null
  ),
}));

describe('ForgotPasswordModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<ForgotPasswordModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
    });

    it('should render email form initially', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar enlace de recuperación/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeInTheDocument();
    });

    it('should have proper input attributes', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
    });

    it('should render close button', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByLabelText(/cerrar/i)).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update email input value', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should show error when email is empty', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/por favor ingrese un email válido/i)).toBeInTheDocument();
      });
    });

    it('should accept valid email format', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      expect(screen.queryByText(/por favor ingrese un email válido/i)).not.toBeInTheDocument();
    });

    it('should trim whitespace from email', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      // Should not show validation error for properly formatted email (after trimming)
      expect(screen.queryByText(/por favor ingrese un email válido/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      expect(screen.getByRole('button', { name: /enviando\.\.\./i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviando\.\.\./i })).toBeDisabled();
      expect(emailInput).toBeDisabled();
    });

    it('should show success message after submission', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      // Fast-forward time to complete the async operation
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
        expect(screen.getByText(/enviado correctamente/i)).toBeInTheDocument();
        expect(screen.getByText(/se ha enviado un enlace de recuperación/i)).toBeInTheDocument();
      });
    });

    it('should show close button in success state', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        const closeButtons = screen.getAllByRole('button', { name: /cerrar/i });
        expect(closeButtons.length).toBeGreaterThan(0);
        // The success state should have at least one close button
        const successCloseButton = closeButtons.find(btn => btn.textContent === 'Cerrar');
        expect(successCloseButton).toBeInTheDocument();
      });
    });
  });

  describe('Modal Closing', () => {
    it('should call onClose when close button is clicked', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/cerrar/i);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose from success state close button', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      // Navigate to success state
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByRole('button', { name: /cerrar/i });
      const closeButton = closeButtons.find(btn => btn.textContent === 'Cerrar') || closeButtons[0];
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should reset form state when modal is closed', async () => {
      const { rerender } = render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      // Fill form and show error
      const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/por favor ingrese un email válido/i)).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByLabelText(/cerrar/i);
      fireEvent.click(closeButton);

      // Reopen modal - should be reset
      rerender(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      expect(emailInput.value).toBe('');
      expect(screen.queryByText(/por favor ingrese un email válido/i)).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should clear error when new valid input is entered', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      // Create error
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      });

      // Submit with valid email - error should clear
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      expect(screen.queryByText(/el email es requerido/i)).not.toBeInTheDocument();
    });

    it('should maintain email value during loading state', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      // Email value should be preserved during loading
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should have proper modal title', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
    });

    it('should have proper submit button type', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should update title in success state', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      fireEvent.click(submitButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple form submissions during loading', () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });
      
      // First submission
      fireEvent.click(submitButton);
      expect(screen.getByText(/enviando\.\.\./i)).toBeInTheDocument();

      // Second submission should be ignored (button is disabled)
      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
    });

    it('should handle invalid email formats', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const invalidEmail = '@domain.com';
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      fireEvent.change(emailInput, { target: { value: invalidEmail } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/por favor ingrese un email válido/i)).toBeInTheDocument();
      });
    });

    it('should handle valid edge case email formats', async () => {
      render(<ForgotPasswordModal isOpen={true} onClose={mockOnClose} />);

      const validEmail = 'a@b.co';
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /enviar enlace de recuperación/i });

      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.click(submitButton);

      // Should not show validation error for valid emails
      expect(screen.queryByText(/por favor ingrese un email válido/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/el email es requerido/i)).not.toBeInTheDocument();

      // Wait for loading to start to confirm submission was triggered
      await waitFor(() => {
        expect(screen.getByText(/enviando\.\.\./i)).toBeInTheDocument();
      });
    });
  });
});