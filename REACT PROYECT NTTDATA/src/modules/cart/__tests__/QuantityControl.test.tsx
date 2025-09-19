// QuantityControl.jest.test.tsx - Tests unitarios para QuantityControl component
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuantityControl from '@/modules/cart/components/QuantityControl';

describe('QuantityControl Component', () => {
  const mockOnInc = jest.fn();
  const mockOnDec = jest.fn();

  const defaultProps = {
    qty: 1,
    onInc: mockOnInc,
    onDec: mockOnDec
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado y estructura', () => {
    test('debe renderizar correctamente con props básicas', () => {
      render(<QuantityControl {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Disminuir' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Incrementar' })).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    test('debe mostrar la cantidad correcta en el input', () => {
      render(<QuantityControl {...defaultProps} qty={5} />);

      const input = screen.getByDisplayValue('5');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('readonly');
    });

    test('debe tener la estructura HTML correcta', () => {
      const { container } = render(<QuantityControl {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      });
    });

    test('debe renderizar botones con estilos correctos', () => {
      render(<QuantityControl {...defaultProps} />);

      const decButton = screen.getByRole('button', { name: 'Disminuir' });
      const incButton = screen.getByRole('button', { name: 'Incrementar' });

      expect(decButton).toHaveStyle({ width: '28px' });
      expect(incButton).toHaveStyle({ width: '28px' });
      expect(decButton).toHaveTextContent('−');
      expect(incButton).toHaveTextContent('＋');
    });

    test('debe renderizar input con estilos correctos', () => {
      render(<QuantityControl {...defaultProps} />);

      const input = screen.getByDisplayValue('1');
      expect(input).toHaveStyle({
        width: '40px',
        textAlign: 'center'
      });
    });
  });

  describe('interacción con botones', () => {
    test('debe llamar onDec cuando se clickea el botón disminuir', () => {
      render(<QuantityControl {...defaultProps} />);

      const decButton = screen.getByRole('button', { name: 'Disminuir' });
      fireEvent.click(decButton);

      expect(mockOnDec).toHaveBeenCalledTimes(1);
      expect(mockOnInc).not.toHaveBeenCalled();
    });

    test('debe llamar onInc cuando se clickea el botón incrementar', () => {
      render(<QuantityControl {...defaultProps} />);

      const incButton = screen.getByRole('button', { name: 'Incrementar' });
      fireEvent.click(incButton);

      expect(mockOnInc).toHaveBeenCalledTimes(1);
      expect(mockOnDec).not.toHaveBeenCalled();
    });

    test('debe permitir múltiples clicks en botones', () => {
      render(<QuantityControl {...defaultProps} />);

      const decButton = screen.getByRole('button', { name: 'Disminuir' });
      const incButton = screen.getByRole('button', { name: 'Incrementar' });

      fireEvent.click(incButton);
      fireEvent.click(incButton);
      fireEvent.click(decButton);

      expect(mockOnInc).toHaveBeenCalledTimes(2);
      expect(mockOnDec).toHaveBeenCalledTimes(1);
    });
  });

  describe('estado disabled del botón incrementar', () => {
    test('debe habilitar botón incrementar por defecto', () => {
      render(<QuantityControl {...defaultProps} />);

      const incButton = screen.getByRole('button', { name: 'Incrementar' });
      expect(incButton).toBeEnabled();
    });

    test('debe deshabilitar botón incrementar cuando disabledInc es true', () => {
      render(<QuantityControl {...defaultProps} disabledInc={true} />);

      const incButton = screen.getByRole('button', { name: 'Incrementar' });
      expect(incButton).toBeDisabled();
    });

    test('debe habilitar botón incrementar cuando disabledInc es false', () => {
      render(<QuantityControl {...defaultProps} disabledInc={false} />);

      const incButton = screen.getByRole('button', { name: 'Incrementar' });
      expect(incButton).toBeEnabled();
    });

    test('no debe llamar onInc cuando botón está disabled', () => {
      render(<QuantityControl {...defaultProps} disabledInc={true} />);

      const incButton = screen.getByRole('button', { name: 'Incrementar' });
      fireEvent.click(incButton);

      expect(mockOnInc).not.toHaveBeenCalled();
    });

    test('debe siempre mantener botón decrementar habilitado', () => {
      render(<QuantityControl {...defaultProps} disabledInc={true} />);

      const decButton = screen.getByRole('button', { name: 'Disminuir' });
      expect(decButton).toBeEnabled();

      fireEvent.click(decButton);
      expect(mockOnDec).toHaveBeenCalledTimes(1);
    });
  });

  describe('diferentes valores de cantidad', () => {
    test('debe manejar cantidad 0 correctamente', () => {
      render(<QuantityControl {...defaultProps} qty={0} />);

      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    test('debe manejar cantidades grandes correctamente', () => {
      render(<QuantityControl {...defaultProps} qty={999} />);

      expect(screen.getByDisplayValue('999')).toBeInTheDocument();
    });

    test('debe actualizar display cuando qty cambia', () => {
      const { rerender } = render(<QuantityControl {...defaultProps} qty={1} />);

      expect(screen.getByDisplayValue('1')).toBeInTheDocument();

      rerender(<QuantityControl {...defaultProps} qty={5} />);
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('1')).not.toBeInTheDocument();
    });
  });

  describe('accesibilidad', () => {
    test('debe tener labels aria correctos en los botones', () => {
      render(<QuantityControl {...defaultProps} />);

      expect(screen.getByLabelText('Disminuir')).toBeInTheDocument();
      expect(screen.getByLabelText('Incrementar')).toBeInTheDocument();
    });

    test('debe ser navegable por teclado', () => {
      render(<QuantityControl {...defaultProps} />);

      const decButton = screen.getByRole('button', { name: 'Disminuir' });
      const incButton = screen.getByRole('button', { name: 'Incrementar' });

      // Los botones son elementos button por defecto
      expect(decButton.tagName).toBe('BUTTON');
      expect(incButton.tagName).toBe('BUTTON');
    });

    test('input debe ser readonly para evitar edición manual', () => {
      render(<QuantityControl {...defaultProps} />);

      const input = screen.getByDisplayValue('1');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('edge cases y comportamiento extremo', () => {
    test('debe manejar funciones noop sin crashear', () => {
      const onInc = () => {};
      const onDec = () => {};

      expect(() => {
        render(<QuantityControl qty={1} onInc={onInc} onDec={onDec} />);
      }).not.toThrow();
    });

    test('debe mantener estructura con props mínimas requeridas', () => {
      render(
        <QuantityControl 
          qty={1} 
          onInc={() => {}} 
          onDec={() => {}} 
        />
      );

      expect(screen.getByRole('button', { name: 'Disminuir' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Incrementar' })).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });
  });
});