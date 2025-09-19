// DistrictSelect.jest.test.tsx - Tests unitarios para DistrictSelect component
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DistrictSelect from '@/modules/cart/components/DistrictSelect';

// Mock del hook useDistricts
const mockUseDistricts = jest.fn();
jest.mock('@/modules/cart/hooks/useDistricts', () => ({
  useDistricts: () => mockUseDistricts()
}));

describe('DistrictSelect Component', () => {
  const mockOnChange = jest.fn();
  
  const defaultProps = {
    value: '',
    onChange: mockOnChange
  };

  const mockDistrictsData = {
    districts: ['Lima', 'Callao', 'San Isidro', 'Miraflores'],
    loading: false,
    err: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDistricts.mockReturnValue(mockDistrictsData);
  });

  describe('renderizado básico', () => {
    test('debe renderizar correctamente con datos cargados', () => {
      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByLabelText('Distrito')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Seleccione…')).toBeInTheDocument();
    });

    test('debe mostrar todos los distritos como opciones', () => {
      render(<DistrictSelect {...defaultProps} />);

      mockDistrictsData.districts.forEach(district => {
        expect(screen.getByRole('option', { name: district })).toBeInTheDocument();
      });
    });

    test('debe tener la estructura HTML correcta', () => {
      const { container } = render(<DistrictSelect {...defaultProps} />);

      const label = container.querySelector('label');
      expect(label).toHaveStyle({
        display: 'block',
        marginBottom: '12px'
      });

      const span = container.querySelector('span');
      expect(span).toHaveStyle({
        display: 'block',
        marginBottom: '4px'
      });

      const select = screen.getByRole('combobox');
      expect(select).toHaveStyle({
        width: '100%',
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1'
      });
    });
  });

  describe('estado de carga', () => {
    test('debe deshabilitar select cuando está cargando', () => {
      mockUseDistricts.mockReturnValue({
        ...mockDistrictsData,
        loading: true
      });

      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    test('debe mostrar solo opción por defecto cuando está cargando', () => {
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: true,
        err: null
      });

      render(<DistrictSelect {...defaultProps} />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Seleccione…');
    });
  });

  describe('manejo de errores', () => {
    test('debe deshabilitar select cuando hay error del hook', () => {
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: false,
        err: 'Error cargando distritos'
      });

      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    test('debe mostrar error del hook', () => {
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: false,
        err: 'Error cargando distritos'
      });

      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByText('Error cargando distritos')).toBeInTheDocument();
    });

    test('debe mostrar error de validación cuando se proporciona', () => {
      render(<DistrictSelect {...defaultProps} error="Campo requerido" />);

      expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    });

    test('debe priorizar error de validación sobre error del hook', () => {
      mockUseDistricts.mockReturnValue({
        districts: ['Lima'],
        loading: false,
        err: 'Error del hook'
      });

      render(<DistrictSelect {...defaultProps} error="Error de validación" />);

      expect(screen.getByText('Error de validación')).toBeInTheDocument();
      expect(screen.queryByText('Error del hook')).not.toBeInTheDocument();
    });

    test('debe aplicar estilos de error al mensaje', () => {
      render(<DistrictSelect {...defaultProps} error="Campo requerido" />);

      const errorMessage = screen.getByText('Campo requerido');
      expect(errorMessage).toHaveStyle({ color: 'crimson' });
      expect(errorMessage.tagName).toBe('SMALL');
    });
  });

  describe('interacción del usuario', () => {
    test('debe llamar onChange cuando se selecciona una opción', () => {
      render(<DistrictSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Lima' } });

      expect(mockOnChange).toHaveBeenCalledWith('Lima');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('debe llamar onChange con string vacío cuando se selecciona opción por defecto', () => {
      render(<DistrictSelect {...defaultProps} value="Lima" />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '' } });

      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    test('debe mostrar el valor seleccionado correctamente', () => {
      render(<DistrictSelect {...defaultProps} value="San Isidro" />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('San Isidro');
    });

    test('debe permitir cambiar entre diferentes opciones', () => {
      const { rerender } = render(<DistrictSelect {...defaultProps} value="Lima" />);

      let select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('Lima');

      rerender(<DistrictSelect {...defaultProps} value="Callao" />);
      
      select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('Callao');
    });
  });

  describe('casos edge y diferentes datos', () => {
    test('debe manejar lista vacía de distritos', () => {
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: false,
        err: null
      });

      render(<DistrictSelect {...defaultProps} />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1); // Solo la opción por defecto
      expect(options[0]).toHaveTextContent('Seleccione…');
    });

    test('debe manejar distrito con caracteres especiales', () => {
      mockUseDistricts.mockReturnValue({
        districts: ['San José', 'Villa María', 'Año Nuevo'],
        loading: false,
        err: null
      });

      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('option', { name: 'San José' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Villa María' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Año Nuevo' })).toBeInTheDocument();
    });

    test('debe manejar distritos con nombres muy largos', () => {
      const longDistrictName = 'Distrito con Nombre Extremadamente Largo Para Probar';
      mockUseDistricts.mockReturnValue({
        districts: [longDistrictName],
        loading: false,
        err: null
      });

      render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('option', { name: longDistrictName })).toBeInTheDocument();
    });

    test('debe manejar duplicados en lista de distritos sin crashear', () => {
      mockUseDistricts.mockReturnValue({
        districts: ['Lima', 'Lima', 'Callao'],
        loading: false,
        err: null
      });

      expect(() => {
        render(<DistrictSelect {...defaultProps} />);
      }).not.toThrow();

      // Debe renderizar todas las opciones (incluyendo duplicados)
      const limaOptions = screen.getAllByRole('option', { name: 'Lima' });
      expect(limaOptions).toHaveLength(2);
    });
  });

  describe('accesibilidad', () => {
    test('debe tener etiqueta asociada correctamente', () => {
      render(<DistrictSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      const label = screen.getByText('Distrito');
      
      expect(select).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    test('debe ser navegable por teclado', () => {
      render(<DistrictSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeEnabled();
      expect(select.tagName).toBe('SELECT');
    });

    test('debe mantener accesibilidad cuando está disabled', () => {
      mockUseDistricts.mockReturnValue({
        ...mockDistrictsData,
        loading: true
      });

      render(<DistrictSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      // Sigue siendo un select válido aunque esté disabled
      expect(select.tagName).toBe('SELECT');
    });
  });

  describe('integración con useDistricts hook', () => {
    test('debe llamar useDistricts hook', () => {
      render(<DistrictSelect {...defaultProps} />);

      expect(mockUseDistricts).toHaveBeenCalled();
    });

    test('debe reaccionar a cambios en el estado del hook', () => {
      const { rerender } = render(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeEnabled();

      // Simular cambio a estado de carga
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: true,
        err: null
      });

      rerender(<DistrictSelect {...defaultProps} />);
      
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    test('debe manejar transición de carga a datos cargados', () => {
      // Iniciar en estado de carga
      mockUseDistricts.mockReturnValue({
        districts: [],
        loading: true,
        err: null
      });

      const { rerender } = render(<DistrictSelect {...defaultProps} />);
      
      expect(screen.getByRole('combobox')).toBeDisabled();
      expect(screen.getAllByRole('option')).toHaveLength(1);

      // Cambiar a datos cargados
      mockUseDistricts.mockReturnValue(mockDistrictsData);
      rerender(<DistrictSelect {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeEnabled();
      expect(screen.getAllByRole('option')).toHaveLength(5); // 1 + 4 distritos
    });
  });
});