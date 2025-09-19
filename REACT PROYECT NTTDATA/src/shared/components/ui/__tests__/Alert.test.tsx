// Alert.test.tsx - Unit tests for Alert component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '@/shared/components/ui/Alert';

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('should render with error type and message', () => {
      render(<Alert type="error" message="Error message" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toHaveClass('alert-message');
    });

    it('should render with success type and message', () => {
      render(<Alert type="success" message="Success message" />);

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toHaveClass('alert-message');
    });

    it('should render with warning type and message', () => {
      render(<Alert type="warning" message="Warning message" />);

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toHaveClass('alert-message');
    });

    it('should render with info type and message', () => {
      render(<Alert type="info" message="Info message" />);

      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toHaveClass('alert-message');
    });
  });

  describe('CSS Classes', () => {
    it('should apply error alert class for error type', () => {
      render(<Alert type="error" message="Test message" />);

      const alertDiv = screen.getByText('Test message').parentElement;
      expect(alertDiv).toHaveClass('alert alert-error');
    });

    it('should apply success alert class for success type', () => {
      render(<Alert type="success" message="Test message" />);

      const alertDiv = screen.getByText('Test message').parentElement;
      expect(alertDiv).toHaveClass('alert alert-success');
    });

    it('should apply warning alert class for warning type', () => {
      render(<Alert type="warning" message="Test message" />);

      const alertDiv = screen.getByText('Test message').parentElement;
      expect(alertDiv).toHaveClass('alert alert-warning');
    });

    it('should apply info alert class for info type', () => {
      render(<Alert type="info" message="Test message" />);

      const alertDiv = screen.getByText('Test message').parentElement;
      expect(alertDiv).toHaveClass('alert alert-info');
    });
  });

  describe('Close Button', () => {
    it('should render close button when onClose prop is provided', () => {
      const onClose = jest.fn();
      render(<Alert type="error" message="Test message" onClose={onClose} />);

      const closeButton = screen.getByLabelText('Cerrar alerta');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('alert-close');
      expect(closeButton).toHaveTextContent('×');
    });

    it('should not render close button when onClose prop is not provided', () => {
      render(<Alert type="error" message="Test message" />);

      expect(screen.queryByLabelText('Cerrar alerta')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<Alert type="error" message="Test message" onClose={onClose} />);

      const closeButton = screen.getByLabelText('Cerrar alerta');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose multiple times when clicked multiple times', () => {
      const onClose = jest.fn();
      render(<Alert type="error" message="Test message" onClose={onClose} />);

      const closeButton = screen.getByLabelText('Cerrar alerta');
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(3);
    });
  });

  describe('Message Content', () => {
    it('should display simple string messages', () => {
      render(<Alert type="info" message="Simple message" />);

      expect(screen.getByText('Simple message')).toBeInTheDocument();
    });

    it('should display messages with special characters', () => {
      render(<Alert type="info" message="Message with special chars: !@#$%^&*()" />);

      expect(screen.getByText('Message with special chars: !@#$%^&*()')).toBeInTheDocument();
    });

    it('should display long messages', () => {
      const longMessage = 'This is a very long message that should still be displayed correctly in the alert component without any truncation or issues';
      render(<Alert type="info" message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should display empty messages', () => {
      const { container } = render(<Alert type="info" message="" />);

      const messageElement = container.querySelector('.alert-message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveClass('alert-message');
      expect(messageElement).toHaveTextContent('');
    });

    it('should display messages with HTML entities', () => {
      render(<Alert type="info" message="Price: $25.99 & tax included" />);

      expect(screen.getByText('Price: $25.99 & tax included')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for close button', () => {
      const onClose = jest.fn();
      render(<Alert type="error" message="Test message" onClose={onClose} />);

      const closeButton = screen.getByLabelText('Cerrar alerta');
      expect(closeButton).toBeInTheDocument();
    });

    it('should be keyboard accessible for close button', () => {
      const onClose = jest.fn();
      render(<Alert type="error" message="Test message" onClose={onClose} />);

      const closeButton = screen.getByLabelText('Cerrar alerta');
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });

    it('should have proper semantic structure', () => {
      render(<Alert type="error" message="Test message" />);

      const alert = screen.getByText('Test message').parentElement;
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert');
    });
  });

  describe('Component Structure', () => {
    it('should have proper HTML structure without close button', () => {
      render(<Alert type="info" message="Test message" />);

      const alertDiv = screen.getByText('Test message').parentElement;
      const messageSpan = screen.getByText('Test message');
      
      expect(alertDiv).toContainElement(messageSpan);
      expect(messageSpan).toHaveClass('alert-message');
    });

    it('should have proper HTML structure with close button', () => {
      const onClose = jest.fn();
      render(<Alert type="info" message="Test message" onClose={onClose} />);

      const alertDiv = screen.getByText('Test message').parentElement;
      const messageSpan = screen.getByText('Test message');
      const closeButton = screen.getByLabelText('Cerrar alerta');
      
      expect(alertDiv).toContainElement(messageSpan);
      expect(alertDiv).toContainElement(closeButton);
      expect(messageSpan).toHaveClass('alert-message');
      expect(closeButton).toHaveClass('alert-close');
    });
  });

  describe('Props Validation', () => {
    it('should handle all required props correctly', () => {
      render(<Alert type="success" message="Required props test" />);

      expect(screen.getByText('Required props test')).toBeInTheDocument();
    });

    it('should handle optional onClose prop correctly', () => {
      const onClose = jest.fn();
      render(<Alert type="success" message="Optional prop test" onClose={onClose} />);

      expect(screen.getByText('Optional prop test')).toBeInTheDocument();
      expect(screen.getByLabelText('Cerrar alerta')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle re-renders correctly', () => {
      const { rerender } = render(<Alert type="info" message="Initial message" />);

      expect(screen.getByText('Initial message')).toBeInTheDocument();

      rerender(<Alert type="error" message="Updated message" />);

      expect(screen.queryByText('Initial message')).not.toBeInTheDocument();
      expect(screen.getByText('Updated message')).toBeInTheDocument();
      expect(screen.getByText('Updated message').parentElement).toHaveClass('alert alert-error');
    });

    it('should handle onClose prop changes correctly', () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();
      const { rerender } = render(<Alert type="info" message="Test" onClose={onClose1} />);

      fireEvent.click(screen.getByLabelText('Cerrar alerta'));
      expect(onClose1).toHaveBeenCalledTimes(1);

      rerender(<Alert type="info" message="Test" onClose={onClose2} />);
      fireEvent.click(screen.getByLabelText('Cerrar alerta'));
      
      expect(onClose1).toHaveBeenCalledTimes(1);
      expect(onClose2).toHaveBeenCalledTimes(1);
    });
  });
});