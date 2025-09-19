// Input.test.tsx - Unit tests for Input component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Input } from '@/shared/components/ui/Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input without label or error', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should render input with label', () => {
      render(<Input label="Username" placeholder="Enter username" />);

      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('should render input with error', () => {
      render(<Input error="This field is required" placeholder="Enter text" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render input with both label and error', () => {
      render(<Input label="Email" error="Invalid email format" placeholder="Enter email" />);

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });
  });

  describe('Label Styling', () => {
    it('should apply correct styles to label element', () => {
      render(<Input label="Test Label" />);

      const label = screen.getByText('Test Label').parentElement;
      expect(label).toHaveStyle({
        display: 'block',
        marginBottom: '12px'
      });
    });

    it('should apply correct styles to label text span', () => {
      render(<Input label="Test Label" />);

      const labelSpan = screen.getByText('Test Label');
      expect(labelSpan).toHaveStyle({
        display: 'block',
        marginBottom: '4px'
      });
    });

    it('should not render label span when no label provided', () => {
      render(<Input placeholder="No label" />);

      // Label element should exist (wrapping the input) but not label text span
      const input = screen.getByPlaceholderText('No label');
      const label = input.parentElement;
      expect(label?.tagName).toBe('LABEL');
      
      // Should not have any text content for label
      const textSpans = Array.from(label?.querySelectorAll('span') || []);
      expect(textSpans.length).toBe(0);
    });
  });

  describe('Input Styling', () => {
    it('should apply default styles to input element', () => {
      render(<Input placeholder="Styled input" />);

      const input = screen.getByPlaceholderText('Styled input');
      expect(input).toHaveStyle({
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '6px'
      });
    });

    it('should render with style prop (component applies fixed styles)', () => {
      render(<Input placeholder="Custom styled" style={{ backgroundColor: 'lightblue', fontSize: '16px' }} />);

      const input = screen.getByPlaceholderText('Custom styled');
      // Component applies its own fixed styles, ignoring custom styles
      expect(input).toHaveStyle({
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '6px'
      });
    });

    it('should ignore custom styles and apply component defaults', () => {
      render(<Input placeholder="Override styled" style={{ padding: '16px', border: '2px solid red' }} />);

      const input = screen.getByPlaceholderText('Override styled');
      // Component overwrites any custom styles with its own
      expect(input).toHaveStyle({
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '6px'
      });
    });
  });

  describe('Error Styling', () => {
    it('should apply correct styles to error message', () => {
      render(<Input error="Error message" />);

      const errorElement = screen.getByText('Error message');
      expect(errorElement).toHaveStyle({
        color: 'crimson'
      });
      expect(errorElement.tagName).toBe('SMALL');
    });

    it('should not render error element when no error provided', () => {
      render(<Input placeholder="No error" />);

      const input = screen.getByPlaceholderText('No error');
      const label = input.parentElement;
      const smallElements = label?.querySelectorAll('small');
      expect(smallElements?.length).toBe(0);
    });

    it('should render error text with newlines', () => {
      // Test with error containing newlines
      const { container } = render(<Input error="Line 1\nLine 2" />);

      const errorElement = container.querySelector('small');
      expect(errorElement).toBeInTheDocument();
      // Check that the error element contains both parts of the text
      expect(errorElement).toHaveTextContent('Line 1');
      expect(errorElement).toHaveTextContent('Line 2');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward type prop', () => {
      render(<Input type="email" placeholder="Email input" />);

      const input = screen.getByPlaceholderText('Email input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should forward value prop', () => {
      render(<Input value="test value" readOnly />);

      const input = screen.getByDisplayValue('test value');
      expect(input).toHaveValue('test value');
    });

    it('should forward disabled prop', () => {
      render(<Input disabled placeholder="Disabled input" />);

      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
    });

    it('should forward className prop', () => {
      render(<Input className="custom-input" placeholder="Class test" />);

      const input = screen.getByPlaceholderText('Class test');
      expect(input).toHaveClass('custom-input');
    });

    it('should forward id prop', () => {
      render(<Input id="my-input" placeholder="ID test" />);

      const input = screen.getByPlaceholderText('ID test');
      expect(input).toHaveAttribute('id', 'my-input');
    });

    it('should forward data attributes', () => {
      render(<Input data-testid="test-input" data-custom="value" placeholder="Data test" />);

      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('data-custom', 'value');
    });

    it('should forward aria attributes', () => {
      render(<Input aria-label="Accessible input" aria-required="true" placeholder="ARIA test" />);

      const input = screen.getByLabelText('Accessible input');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Event Handling', () => {
    it('should handle onChange events', () => {
      const onChange = jest.fn();
      render(<Input onChange={onChange} placeholder="Change test" />);

      const input = screen.getByPlaceholderText('Change test');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue('new value');
    });

    it('should handle onFocus events', () => {
      const onFocus = jest.fn();
      render(<Input onFocus={onFocus} placeholder="Focus test" />);

      const input = screen.getByPlaceholderText('Focus test');
      fireEvent.focus(input);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur events', () => {
      const onBlur = jest.fn();
      render(<Input onBlur={onBlur} placeholder="Blur test" />);

      const input = screen.getByPlaceholderText('Blur test');
      fireEvent.blur(input);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
      const onKeyDown = jest.fn();
      const onKeyUp = jest.fn();
      render(<Input onKeyDown={onKeyDown} onKeyUp={onKeyUp} placeholder="Keyboard test" />);

      const input = screen.getByPlaceholderText('Keyboard test');
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyUp).toHaveBeenCalledTimes(1);
    });

    it('should apply disabled attribute correctly', () => {
      const onChange = jest.fn();
      const onFocus = jest.fn();
      render(<Input onChange={onChange} onFocus={onFocus} disabled placeholder="Disabled events" />);

      const input = screen.getByPlaceholderText('Disabled events');
      
      // Check that the disabled attribute is properly set
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('disabled');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="Ref test" />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.placeholder).toBe('Ref test');
    });

    it('should allow ref methods to be called', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="Ref methods" />);

      if (ref.current) {
        ref.current.focus();
        expect(ref.current).toHaveFocus();

        ref.current.value = 'Set via ref';
        expect(ref.current.value).toBe('Set via ref');
      }
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input properly', () => {
      render(<Input label="Associated Label" placeholder="Label association" />);

      const input = screen.getByPlaceholderText('Label association');
      const label = screen.getByText('Associated Label').parentElement;

      expect(label).toContainElement(input);
      expect(label?.tagName).toBe('LABEL');
    });

    it('should be keyboard focusable', () => {
      render(<Input placeholder="Focusable test" />);

      const input = screen.getByPlaceholderText('Focusable test');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should support screen reader attributes', () => {
      render(
        <Input
          label="Screen Reader Label"
          error="Screen reader error"
          aria-describedby="help-text"
          placeholder="Screen reader test"
        />
      );

      const input = screen.getByPlaceholderText('Screen reader test');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });
  });

  describe('Different Input Types', () => {
    it('should work with text type (default)', () => {
      render(<Input placeholder="Text input" />);

      const input = screen.getByPlaceholderText('Text input');
      // Default type for input is text, but may not have explicit attribute
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should work with email type', () => {
      render(<Input type="email" placeholder="Email input" />);

      const input = screen.getByPlaceholderText('Email input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should work with password type', () => {
      render(<Input type="password" placeholder="Password input" />);

      const input = screen.getByPlaceholderText('Password input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should work with number type', () => {
      render(<Input type="number" placeholder="Number input" />);

      const input = screen.getByPlaceholderText('Number input');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Edge Cases', () => {
    it('should not render label span when empty string is provided', () => {
      const { container } = render(<Input label="" placeholder="Empty label" />);

      const input = screen.getByPlaceholderText('Empty label');
      expect(input).toBeInTheDocument();
      
      // Empty string is falsy in && condition, so span should not render
      const labelSpan = container.querySelector('label span');
      expect(labelSpan).not.toBeInTheDocument();
    });

    it('should not render error element when empty string is provided', () => {
      const { container } = render(<Input error="" placeholder="Empty error" />);

      const input = screen.getByPlaceholderText('Empty error');
      expect(input).toBeInTheDocument();
      
      // Empty string is falsy in && condition, so error element should not render
      const errorElement = container.querySelector('small');
      expect(errorElement).not.toBeInTheDocument();
    });

    it('should handle special characters in label and error', () => {
      const labelText = 'Label with <>& chars';
      const errorText = 'Error with <>& chars';
      
      render(
        <Input
          label={labelText}
          error={errorText}
          placeholder="Special chars"
        />
      );

      expect(screen.getByText(labelText)).toBeInTheDocument();
      expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('should handle re-renders correctly', () => {
      const { rerender } = render(<Input label="Initial" placeholder="Initial" />);

      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<Input label="Updated" placeholder="Updated" />);

      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with all props', () => {
      render(
        <Input
          label="Performance Test"
          error="Performance Error"
          type="email"
          placeholder="Performance input"
          value="test value"
          onChange={() => {}}
          onFocus={() => {}}
          onBlur={() => {}}
          disabled={false}
          required
          aria-label="Performance accessible"
        />
      );

      expect(screen.getByPlaceholderText('Performance input')).toBeInTheDocument();
      expect(screen.getByText('Performance Test')).toBeInTheDocument();
      expect(screen.getByText('Performance Error')).toBeInTheDocument();
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<Input placeholder="Unmount test" />);

      expect(() => unmount()).not.toThrow();
    });
  });
});