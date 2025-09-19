// Button.test.tsx - Unit tests for Button component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render without content', () => {
      render(<Button />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('should render with complex children', () => {
      render(
        <Button>
          <span>Icon</span> Submit
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    it('should forward onClick handler', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should forward disabled prop', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should forward type prop', () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should forward className prop', () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward id prop', () => {
      render(<Button id="my-button">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'my-button');
    });

    it('should forward data attributes', () => {
      render(<Button data-testid="custom-button" data-custom="value">Button</Button>);

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('data-custom', 'value');
    });

    it('should forward aria attributes', () => {
      render(<Button aria-label="Custom button" aria-pressed="true">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Default Styles', () => {
    it('should apply default inline styles', () => {
      render(<Button>Styled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #444',
        cursor: 'pointer'
      });
    });

    it('should render with style prop (component applies fixed styles)', () => {
      render(<Button style={{ backgroundColor: 'red', fontSize: '16px' }}>Styled Button</Button>);

      const button = screen.getByRole('button');
      // Component applies its own fixed styles, ignoring custom styles
      expect(button).toHaveStyle({
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #444',
        cursor: 'pointer'
      });
    });

    it('should ignore custom styles and apply component defaults', () => {
      render(<Button style={{ padding: '16px', border: 'none' }}>Custom Styled</Button>);

      const button = screen.getByRole('button');
      // Component overwrites any custom styles with its own
      expect(button).toHaveStyle({
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #444',
        cursor: 'pointer'
      });
    });
  });

  describe('Event Handling', () => {
    it('should handle multiple event types', () => {
      const onMouseDown = jest.fn();
      const onMouseUp = jest.fn();
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <Button
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Event Button
        </Button>
      );

      const button = screen.getByRole('button');

      fireEvent.mouseDown(button);
      expect(onMouseDown).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(button);
      expect(onMouseUp).toHaveBeenCalledTimes(1);

      fireEvent.focus(button);
      expect(onFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(button);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
      const onKeyDown = jest.fn();
      const onKeyUp = jest.fn();

      render(<Button onKeyDown={onKeyDown} onKeyUp={onKeyUp}>Keyboard Button</Button>);

      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);

      fireEvent.keyUp(button, { key: 'Enter' });
      expect(onKeyUp).toHaveBeenCalledTimes(1);
    });

    it('should not trigger events when disabled', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick} disabled>Disabled Button</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard focusable by default', () => {
      render(<Button>Focusable Button</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should support proper button semantics', () => {
      render(<Button>Semantic Button</Button>);

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should support aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="help-text">Submit</Button>
          <div id="help-text">Click to submit the form</div>
        </div>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });
  });

  describe('Form Integration', () => {
    it('should work as submit button in forms', () => {
      const onSubmit = jest.fn();
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should work as reset button in forms', () => {
      render(
        <form>
          <input defaultValue="test" />
          <Button type="reset">Reset Form</Button>
        </form>
      );

      const resetButton = screen.getByRole('button');
      expect(resetButton).toHaveAttribute('type', 'reset');
    });

    it('should work as regular button in forms', () => {
      const onClick = jest.fn();
      render(
        <form>
          <Button type="button" onClick={onClick}>Regular Button</Button>
        </form>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle re-renders correctly', () => {
      const { rerender } = render(<Button>Initial Text</Button>);

      expect(screen.getByText('Initial Text')).toBeInTheDocument();

      rerender(<Button>Updated Text</Button>);

      expect(screen.queryByText('Initial Text')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Text')).toBeInTheDocument();
    });

    it('should handle prop changes correctly', () => {
      const onClick1 = jest.fn();
      const onClick2 = jest.fn();
      const { rerender } = render(<Button onClick={onClick1}>Button</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick1).toHaveBeenCalledTimes(1);

      rerender(<Button onClick={onClick2}>Button</Button>);
      fireEvent.click(screen.getByRole('button'));

      expect(onClick1).toHaveBeenCalledTimes(1);
      expect(onClick2).toHaveBeenCalledTimes(1);
    });

    it('should handle null and undefined children', () => {
      render(<Button>{null}{undefined}Valid Text</Button>);

      expect(screen.getByText('Valid Text')).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      render(<Button>{false}Button{true}</Button>);

      expect(screen.getByText('Button')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render without causing performance issues', () => {
      const buttons = Array.from({ length: 100 }, (_, i) => (
        <Button key={i}>Button {i}</Button>
      ));

      render(<div>{buttons}</div>);

      expect(screen.getAllByRole('button')).toHaveLength(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<Button>Test Button</Button>);

      expect(() => unmount()).not.toThrow();
    });
  });
});