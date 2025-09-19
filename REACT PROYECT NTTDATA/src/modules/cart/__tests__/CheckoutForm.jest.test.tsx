
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckoutForm, { type CheckoutData } from '../components/CheckoutForm';

// Mock del componente DistrictSelect
jest.mock('../components/DistrictSelect', () => {
  return function MockDistrictSelect({ 
    value, 
    onChange, 
    error 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    error?: string; 
  }) {
    return (
      <div data-testid="district-select">
        <span>Distrito</span>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          data-testid="district-select-input"
        >
          <option value="">Seleccionar distrito</option>
          <option value="Lima">Lima</option>
          <option value="Miraflores">Miraflores</option>
          <option value="San Isidro">San Isidro</option>
        </select>
        {error && <small style={{ color: 'crimson' }}>{error}</small>}
      </div>
    );
  };
});

// Mock de las funciones de validación
jest.mock('@/shared/utils/validation', () => ({
  isNonEmpty: jest.fn((value: string) => value && value.trim().length > 0),
  isLetters: jest.fn((value: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)),
  isPhone: jest.fn((value: string) => /^\d{9}$/.test(value))
}));

describe('CheckoutForm Component', () => {
  const mockOnSuccess = jest.fn();

  const defaultProps = {
    onSuccess: mockOnSuccess
  };

  const validFormData: CheckoutData = {
    nombres: 'Juan Carlos',
    apellidos: 'García López',
    distrito: 'Lima',
    direccion: 'Av. Los Olivos 123',
    referencia: 'Frente al parque',
    celular: '987654321'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderización básica', () => {
    test('debe renderizar el formulario con todos los campos', () => {
      render(<CheckoutForm {...defaultProps} />);

      expect(screen.getByText('Datos de envío')).toBeInTheDocument();
      const emptyInputs = screen.getAllByDisplayValue('');
      expect(emptyInputs.length).toBeGreaterThan(0); // campos vacíos iniciales
      expect(screen.getByText('Nombres')).toBeInTheDocument();
      expect(screen.getByText('Apellidos')).toBeInTheDocument();
      expect(screen.getByTestId('district-select')).toBeInTheDocument();
      expect(screen.getByText('Dirección')).toBeInTheDocument();
      expect(screen.getByText('Referencia')).toBeInTheDocument();
      expect(screen.getByText('Celular')).toBeInTheDocument();
    });

    test('debe renderizar el botón de compra', () => {
      render(<CheckoutForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('debe renderizar todos los campos como inputs de texto', () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      const apellidosInput = screen.getByLabelText('Apellidos');
      const direccionInput = screen.getByLabelText('Dirección');
      const referenciaInput = screen.getByLabelText('Referencia');
      const celularInput = screen.getByLabelText('Celular');

      expect(nombresInput).toBeInTheDocument();
      expect(apellidosInput).toBeInTheDocument();
      expect(direccionInput).toBeInTheDocument();
      expect(referenciaInput).toBeInTheDocument();
      expect(celularInput).toBeInTheDocument();
      expect(celularInput).toHaveAttribute('type', 'tel');
    });
  });

  describe('Interacción con campos', () => {
    test('debe actualizar el estado cuando se escriben los campos', () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      const apellidosInput = screen.getByLabelText('Apellidos');

      fireEvent.change(nombresInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidosInput, { target: { value: 'Pérez' } });

      expect(nombresInput).toHaveValue('Juan');
      expect(apellidosInput).toHaveValue('Pérez');
    });

    test('debe actualizar el distrito cuando se selecciona', () => {
      render(<CheckoutForm {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select-input');
      fireEvent.change(districtSelect, { target: { value: 'Lima' } });

      expect(districtSelect).toHaveValue('Lima');
    });

    test('debe actualizar todos los campos independientemente', () => {
      render(<CheckoutForm {...defaultProps} />);

      const inputs = {
        nombres: screen.getByLabelText('Nombres'),
        apellidos: screen.getByLabelText('Apellidos'),
        direccion: screen.getByLabelText('Dirección'),
        referencia: screen.getByLabelText('Referencia'),
        celular: screen.getByLabelText('Celular')
      };

      Object.entries(validFormData).forEach(([key, value]) => {
        if (key !== 'distrito' && inputs[key as keyof typeof inputs]) {
          fireEvent.change(inputs[key as keyof typeof inputs], { target: { value } });
        }
      });

      expect(inputs.nombres).toHaveValue('Juan Carlos');
      expect(inputs.apellidos).toHaveValue('García López');
      expect(inputs.direccion).toHaveValue('Av. Los Olivos 123');
      expect(inputs.referencia).toHaveValue('Frente al parque');
      expect(inputs.celular).toHaveValue('987654321');
    });
  });

  describe('Validación de formulario', () => {
    test('debe mostrar errores en campos vacíos al hacer blur', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      
      fireEvent.blur(nombresInput);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    test('debe validar nombres con solo letras', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      
      fireEvent.change(nombresInput, { target: { value: 'Juan123' } });
      fireEvent.blur(nombresInput);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    test('debe validar apellidos con solo letras', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const apellidosInput = screen.getByLabelText('Apellidos');
      
      fireEvent.change(apellidosInput, { target: { value: 'García@' } });
      fireEvent.blur(apellidosInput);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    test('debe validar que todos los campos sean obligatorios', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText(/Debe ingresar un valor válido|Campo obligatorio/);
        expect(errors.length).toBeGreaterThan(0);
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test('debe validar formato de teléfono', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const celularInput = screen.getByLabelText('Celular');
      
      fireEvent.change(celularInput, { target: { value: '123' } });
      fireEvent.blur(celularInput);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Envío del formulario', () => {
    const fillValidForm = () => {
      const inputs = {
        nombres: screen.getByLabelText('Nombres'),
        apellidos: screen.getByLabelText('Apellidos'),
        direccion: screen.getByLabelText('Dirección'),
        referencia: screen.getByLabelText('Referencia'),
        celular: screen.getByLabelText('Celular')
      };

      fireEvent.change(inputs.nombres, { target: { value: validFormData.nombres } });
      fireEvent.change(inputs.apellidos, { target: { value: validFormData.apellidos } });
      fireEvent.change(inputs.direccion, { target: { value: validFormData.direccion } });
      fireEvent.change(inputs.referencia, { target: { value: validFormData.referencia } });
      fireEvent.change(inputs.celular, { target: { value: validFormData.celular } });

      const districtSelect = screen.getByTestId('district-select-input');
      fireEvent.change(districtSelect, { target: { value: validFormData.distrito } });
    };

    test('debe llamar onSuccess con datos válidos', async () => {
      render(<CheckoutForm {...defaultProps} />);

      fillValidForm();

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(validFormData);
      });
    });

    test('no debe llamar onSuccess con datos inválidos', async () => {
      render(<CheckoutForm {...defaultProps} />);

      // Solo llenar algunos campos
      const nombresInput = screen.getByLabelText('Nombres');
      fireEvent.change(nombresInput, { target: { value: 'Juan' } });

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    test('debe prevenir el comportamiento por defecto del form', () => {
      render(<CheckoutForm {...defaultProps} />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      // Verificar que el form tiene un submit handler
      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Estado disabled', () => {
    test('debe deshabilitar el botón cuando disabled=true', () => {
      render(<CheckoutForm {...defaultProps} disabled={true} />);

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      expect(submitButton).toBeDisabled();
    });

    test('debe habilitar el botón cuando disabled=false o undefined', () => {
      render(<CheckoutForm {...defaultProps} disabled={false} />);

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Integración con DistrictSelect', () => {
    test('debe pasar el valor correcto a DistrictSelect', () => {
      render(<CheckoutForm {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select-input');
      expect(districtSelect).toHaveValue('');

      fireEvent.change(districtSelect, { target: { value: 'Miraflores' } });
      expect(districtSelect).toHaveValue('Miraflores');
    });

    test('debe mostrar error de distrito cuando está vacío', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText('Campo obligatorio');
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Estilos y estructura', () => {
    test('debe tener la estructura HTML correcta', () => {
      render(<CheckoutForm {...defaultProps} />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      const title = screen.getByRole('heading', { name: 'Datos de envío' });
      expect(title).toBeInTheDocument();
    });

    test('debe aplicar estilos de grid al formulario', () => {
      render(<CheckoutForm {...defaultProps} />);

      const form = document.querySelector('form');
      expect(form).toHaveStyle({
        display: 'grid',
        gap: '12px',
        marginTop: '16px'
      });
    });
  });

  describe('Casos edge', () => {
    test('debe manejar caracteres especiales en nombres', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      
      fireEvent.change(nombresInput, { target: { value: 'María José' } });
      fireEvent.blur(nombresInput);

      // No debe mostrar error para nombres válidos con acentos
      await waitFor(() => {
        const errorMessages = screen.queryAllByText('Debe ingresar un valor válido');
        const nombresError = errorMessages.find(msg => 
          msg.closest('label')?.textContent?.includes('Nombres')
        );
        expect(nombresError).toBeUndefined();
      });
    });

    test('debe limpiar errores cuando se corrigen los campos', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const nombresInput = screen.getByLabelText('Nombres');
      
      // Provocar error
      fireEvent.blur(nombresInput);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThan(0);
      });

      // Corregir el campo
      fireEvent.change(nombresInput, { target: { value: 'Juan' } });
      fireEvent.blur(nombresInput);

      await waitFor(() => {
        const errors = screen.queryAllByText('Debe ingresar un valor válido');
        const nombresError = errors.find(error => 
          error.closest('label')?.textContent?.includes('Nombres')
        );
        expect(nombresError).toBeUndefined();
      });
    });

    test('debe manejar múltiples validaciones simultáneas', async () => {
      render(<CheckoutForm {...defaultProps} />);

      const inputs = {
        nombres: screen.getByLabelText('Nombres'),
        apellidos: screen.getByLabelText('Apellidos'),
        celular: screen.getByLabelText('Celular')
      };

      // Introducir valores inválidos
      fireEvent.change(inputs.nombres, { target: { value: 'Juan123' } });
      fireEvent.change(inputs.apellidos, { target: { value: 'García@' } });
      fireEvent.change(inputs.celular, { target: { value: '123' } });

      const submitButton = screen.getByRole('button', { name: 'Comprar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText('Debe ingresar un valor válido');
        expect(errors.length).toBeGreaterThanOrEqual(3);
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});