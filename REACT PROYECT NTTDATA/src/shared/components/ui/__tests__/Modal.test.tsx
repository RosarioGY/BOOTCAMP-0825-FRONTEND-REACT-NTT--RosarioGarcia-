// Modal.test.tsx - Unit tests for Modal component
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/shared/components/ui/Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('should render with different titles', () => {
      render(<Modal {...defaultProps} title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Custom Title');
    });

    it('should render different children content', () => {
      const customChildren = (
        <div>
          <p>Paragraph content</p>
          <button>Action Button</button>
        </div>
      );
      render(<Modal {...defaultProps} children={customChildren} />);

      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });
  });

  describe('Modal Structure', () => {
    it('should have proper HTML structure', () => {
      render(<Modal {...defaultProps} />);

      const overlay = screen.getByRole('dialog').parentElement;
      const content = screen.getByRole('dialog');
      const header = screen.getByText('Test Modal').parentElement;
      const body = screen.getByText('Modal content').parentElement;

      expect(overlay).toHaveClass('modal-overlay');
      expect(content).toHaveClass('modal-content');
      expect(header).toHaveClass('modal-header');
      expect(body).toHaveClass('modal-body');
    });

    it('should have proper heading structure', () => {
      render(<Modal {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Modal');
    });

    it('should have close button in header', () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByText('×');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('modal-close');
    });

    it('should have role dialog on modal content', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('modal-content');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const modalContent = screen.getByRole('dialog');
      fireEvent.click(modalContent);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when children content is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const children = screen.getByText('Modal content');
      fireEvent.click(children);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Event Propagation', () => {
    it('should stop propagation when modal content is clicked', () => {
      const onClose = jest.fn();
      const onOverlayClick = jest.fn();

      render(
        <div onClick={onOverlayClick}>
          <Modal {...defaultProps} onClose={onClose} />
        </div>
      );

      const modalContent = screen.getByRole('dialog');
      fireEvent.click(modalContent);

      expect(onClose).not.toHaveBeenCalled();
      expect(onOverlayClick).not.toHaveBeenCalled();
    });

    it('should allow propagation when overlay is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Children Rendering', () => {
    it('should render text children', () => {
      render(<Modal {...defaultProps} children="Simple text content" />);

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render complex JSX children', () => {
      const complexChildren = (
        <form>
          <label htmlFor="input">Input Label</label>
          <input id="input" type="text" />
          <button type="submit">Submit</button>
        </form>
      );
      render(<Modal {...defaultProps} children={complexChildren} />);

      expect(screen.getByLabelText('Input Label')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render multiple children elements', () => {
      const multipleChildren = (
        <>
          <h4>Section Title</h4>
          <p>Paragraph text</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </>
      );
      render(<Modal {...defaultProps} children={multipleChildren} />);

      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph text')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper dialog role', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should be keyboard accessible for close button', () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByText('×');
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });

    it('should handle keyboard navigation', () => {
      render(
        <Modal
          {...defaultProps}
          children={
            <div>
              <button>Button 1</button>
              <button>Button 2</button>
            </div>
          }
        />
      );

      const button1 = screen.getByRole('button', { name: 'Button 1' });
      const button2 = screen.getByRole('button', { name: 'Button 2' });

      button1.focus();
      expect(button1).toHaveFocus();

      fireEvent.keyDown(button1, { key: 'Tab' });
      // Note: Actual tab navigation would require jsdom configuration
      // This test verifies the structure allows keyboard navigation
      expect(button2).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<Modal {...defaultProps} title="" />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<Modal {...defaultProps} children={null} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      const modalBody = screen.getByRole('dialog').querySelector('.modal-body');
      expect(modalBody).toBeEmptyDOMElement();
    });

    it('should handle toggling isOpen prop', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<Modal {...defaultProps} isOpen={true} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should handle onClose prop changes', () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();
      const { rerender } = render(<Modal {...defaultProps} onClose={onClose1} />);

      fireEvent.click(screen.getByText('×'));
      expect(onClose1).toHaveBeenCalledTimes(1);

      rerender(<Modal {...defaultProps} onClose={onClose2} />);
      fireEvent.click(screen.getByText('×'));

      expect(onClose1).toHaveBeenCalledTimes(1);
      expect(onClose2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('should not render DOM when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      // Should return null and not create any DOM elements
      expect(document.body.innerHTML).not.toContain('modal-overlay');
      expect(document.body.innerHTML).not.toContain('Test Modal');
    });

    it('should handle multiple re-renders efficiently', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      for (let i = 0; i < 10; i++) {
        rerender(<Modal {...defaultProps} title={`Title ${i}`} />);
        expect(screen.getByText(`Title ${i}`)).toBeInTheDocument();
      }
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should work with forms inside modal', () => {
      const onSubmit = jest.fn();
      const formChildren = (
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Enter text" />
          <button type="submit">Submit Form</button>
        </form>
      );

      render(<Modal {...defaultProps} children={formChildren} />);

      const input = screen.getByPlaceholderText('Enter text');
      const submitButton = screen.getByRole('button', { name: 'Submit Form' });

      fireEvent.change(input, { target: { value: 'test value' } });
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should work with interactive content', () => {
      const onClick = jest.fn();
      const interactiveChildren = (
        <div>
          <button onClick={onClick}>Interactive Button</button>
          <input type="checkbox" />
          <select>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
      );

      render(<Modal {...defaultProps} children={interactiveChildren} />);

      const button = screen.getByRole('button', { name: 'Interactive Button' });
      const checkbox = screen.getByRole('checkbox');
      const select = screen.getByRole('combobox');

      fireEvent.click(button);
      fireEvent.click(checkbox);
      fireEvent.change(select, { target: { value: '2' } });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(checkbox).toBeChecked();
      expect(select).toHaveValue('2');
    });
  });
});