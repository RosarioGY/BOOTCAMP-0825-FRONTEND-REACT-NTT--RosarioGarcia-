// SearchBox.jest.test.tsx - Test unitario para SearchBox
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBox from '@/modules/home/components/SearchBox';

// Mock de las utilidades de locale
jest.mock('@/shared/utils/locale', () => ({
  uiES: {
    searchPlaceholder: 'Buscar productos… (mínimo 3 caracteres)',
  },
}));

describe('SearchBox Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado básico', () => {
    test('debe renderizar el input de búsqueda con placeholder correcto', () => {
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Buscar productos… (mínimo 3 caracteres)');
    });

    test('debe mostrar el valor proporcionado en el input', () => {
      render(<SearchBox value="smartphone" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('smartphone');
    });

    test('no debe mostrar botón clear cuando el valor está vacío', () => {
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.queryByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).not.toBeInTheDocument();
    });

    test('debe mostrar botón clear cuando hay texto', () => {
      render(<SearchBox value="laptop" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('×');
    });
  });

  describe('interacciones del usuario', () => {
    test('debe llamar onChange cuando el usuario escribe', async () => {
      const user = userEvent.setup();
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'smartphone');

      // Cada caracter debería generar un evento onChange
      expect(mockOnChange).toHaveBeenCalledTimes(10); // 'smartphone' = 10 caracteres
      // Verificar algunas llamadas específicas
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 's');
      expect(mockOnChange).toHaveBeenNthCalledWith(10, 'e');
    });

    test('debe llamar onClear cuando se hace click en el botón clear', async () => {
      const user = userEvent.setup();
      render(<SearchBox value="laptop" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      await user.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    test('debe llamar onChange cuando se borra texto', async () => {
      const user = userEvent.setup();
      render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('validación de longitud mínima', () => {
    test('no debe mostrar mensaje de error cuando el input está vacío', () => {
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const errorMessage = screen.queryByText('mínimo son 3 caracteres');
      expect(errorMessage).not.toBeInTheDocument();
    });

    test('debe mostrar mensaje de error cuando hay texto pero menos de 3 caracteres', () => {
      render(<SearchBox value="ab" onChange={mockOnChange} onClear={mockOnClear} />);

      const errorMessage = screen.getByText('mínimo son 3 caracteres');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveStyle({ color: '#b91c1c' });
    });

    test('no debe mostrar mensaje de error cuando hay 3 o más caracteres', () => {
      render(<SearchBox value="abc" onChange={mockOnChange} onClear={mockOnClear} />);

      const errorMessage = screen.queryByText('mínimo son 3 caracteres');
      expect(errorMessage).not.toBeInTheDocument();
    });

    test('debe considerar solo caracteres no vacíos para la validación', () => {
      render(<SearchBox value="  a  " onChange={mockOnChange} onClear={mockOnClear} />);

      const errorMessage = screen.getByText('mínimo son 3 caracteres');
      expect(errorMessage).toBeInTheDocument();
    });

    test('no debe mostrar error con espacios y 3+ caracteres válidos', () => {
      render(<SearchBox value="  abc  " onChange={mockOnChange} onClear={mockOnClear} />);

      const errorMessage = screen.queryByText('mínimo son 3 caracteres');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('estilos y estructura', () => {
    test('debe tener estilos inline correctos en el input', () => {
      render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({
        width: '100%',
        padding: '10px 36px 10px 12px',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
      });
    });

    test('debe tener posición relativa en el contenedor', () => {
      const { container } = render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ position: 'relative' });
    });

    test('debe posicionar el botón clear correctamente', () => {
      render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toHaveStyle({
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        cursor: 'pointer',
      });
    });
  });

  describe('accesibilidad', () => {
    test('debe tener label aria correcto en el botón clear', () => {
      render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toHaveAttribute('aria-label', 'Limpiar búsqueda');
    });

    test('debe ser tipo button el botón clear', () => {
      render(<SearchBox value="test" onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toHaveAttribute('type', 'button');
    });

    test('el input debe ser enfocable', () => {
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('disabled');
    });
  });

  describe('casos edge', () => {
    test('debe manejar valor solo con espacios', () => {
      render(<SearchBox value="   " onChange={mockOnChange} onClear={mockOnClear} />);

      // Debería mostrar el botón clear (hay contenido)
      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toBeInTheDocument();

      // Con solo espacios, trim().length = 0, por lo que NO debería mostrar error
      // (solo muestra error si trim().length > 0 && trim().length < 3)
      expect(screen.queryByText('mínimo son 3 caracteres')).not.toBeInTheDocument();
    });

    test('debe manejar cadenas muy largas', () => {
      const longString = 'a'.repeat(100);
      render(<SearchBox value={longString} onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(longString);

      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toBeInTheDocument();

      const errorMessage = screen.queryByText('mínimo son 3 caracteres');
      expect(errorMessage).not.toBeInTheDocument();
    });

    test('debe manejar caracteres especiales', () => {
      const specialChars = '@#$%^&*()';
      render(<SearchBox value={specialChars} onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(specialChars);

      // 10 caracteres, no debería mostrar error
      const errorMessage = screen.queryByText('mínimo son 3 caracteres');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('múltiples interacciones', () => {
    test('debe manejar escribir, limpiar y escribir de nuevo', async () => {
      const user = userEvent.setup();
      // Iniciar con algún texto para que aparezca el botón clear
      render(<SearchBox value="laptop" onChange={mockOnChange} onClear={mockOnClear} />);

      // Verificar que el botón clear está presente
      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      expect(clearButton).toBeInTheDocument();

      // Hacer click en clear
      await user.click(clearButton);
      expect(mockOnClear).toHaveBeenCalledTimes(1);

      // Verificar que se puede escribir nuevo texto
      const input = screen.getByRole('textbox');
      await user.type(input, 'phone');
      // user.type agrega al final, así que será "laptop" + "phone" = "laptopphone"
      // Verificar que onChange fue llamado con los valores incrementales
      expect(mockOnChange).toHaveBeenCalledWith('laptopp');
      expect(mockOnChange).toHaveBeenCalledWith('laptoph');
    });

    test('debe llamar onChange múltiples veces durante la escritura', async () => {
      const user = userEvent.setup();
      render(<SearchBox value="" onChange={mockOnChange} onClear={mockOnClear} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'abc');

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'a');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'b');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'c');
    });
  });
});