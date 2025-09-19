// CartTotal.jest.test.tsx - Tests unitarios para CartTotal component
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartTotal } from '@/modules/cart/components/CartTotal';

// Mock del utilitario de formateo
jest.mock('@/shared/utils/locale', () => ({
  formatPricePEN: jest.fn()
}));

import { formatPricePEN } from '@/shared/utils/locale';
const mockFormatPricePEN = formatPricePEN as jest.MockedFunction<typeof formatPricePEN>;

describe('CartTotal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configuración por defecto del mock
    mockFormatPricePEN.mockImplementation((price) => `S/ ${price.toFixed(2)}`);
  });

  describe('renderizado básico', () => {
    test('debe renderizar correctamente con total 0', () => {
      render(<CartTotal total={0} />);

      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('S/ 0.00')).toBeInTheDocument();
    });

    test('debe renderizar correctamente con total positivo', () => {
      render(<CartTotal total={1500} />);

      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('S/ 1500.00')).toBeInTheDocument();
    });

    test('debe tener la estructura HTML correcta', () => {
      const { container } = render(<CartTotal total={100} />);

      const cartTotalDiv = container.querySelector('.cart-total');
      expect(cartTotalDiv).toBeInTheDocument();
      expect(cartTotalDiv).toHaveStyle({
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '12px'
      });
    });
  });

  describe('formateo de precios', () => {
    test('debe llamar formatPricePEN con el total correcto', () => {
      render(<CartTotal total={999.99} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(999.99);
      expect(mockFormatPricePEN).toHaveBeenCalledTimes(1);
    });

    test('debe mostrar el precio formateado correctamente', () => {
      mockFormatPricePEN.mockReturnValue('S/ 1,234.56');
      
      render(<CartTotal total={1234.56} />);

      expect(screen.getByText('S/ 1,234.56')).toBeInTheDocument();
    });

    test('debe manejar diferentes formatos de precio', () => {
      mockFormatPricePEN.mockReturnValue('PEN 500.00');
      
      render(<CartTotal total={500} />);

      expect(screen.getByText('PEN 500.00')).toBeInTheDocument();
    });

    test('debe manejar precios con decimales complejos', () => {
      mockFormatPricePEN.mockReturnValue('S/ 999.789');
      
      render(<CartTotal total={999.789} />);

      expect(screen.getByText('S/ 999.789')).toBeInTheDocument();
      expect(mockFormatPricePEN).toHaveBeenCalledWith(999.789);
    });
  });

  describe('diferentes valores de total', () => {
    test('debe manejar total cero', () => {
      mockFormatPricePEN.mockReturnValue('S/ 0.00');
      
      render(<CartTotal total={0} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(0);
      expect(screen.getByText('S/ 0.00')).toBeInTheDocument();
    });

    test('debe manejar totales muy pequeños', () => {
      mockFormatPricePEN.mockReturnValue('S/ 0.01');
      
      render(<CartTotal total={0.01} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(0.01);
      expect(screen.getByText('S/ 0.01')).toBeInTheDocument();
    });

    test('debe manejar totales muy grandes', () => {
      mockFormatPricePEN.mockReturnValue('S/ 999,999.99');
      
      render(<CartTotal total={999999.99} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(999999.99);
      expect(screen.getByText('S/ 999,999.99')).toBeInTheDocument();
    });

    test('debe manejar números con múltiples decimales', () => {
      const complexTotal = 1234.5678901;
      mockFormatPricePEN.mockReturnValue('S/ 1,234.57');
      
      render(<CartTotal total={complexTotal} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(complexTotal);
    });
  });

  describe('estructura y estilos', () => {
    test('debe tener la clase CSS correcta', () => {
      const { container } = render(<CartTotal total={100} />);

      expect(container.querySelector('.cart-total')).toBeInTheDocument();
    });

    test('debe aplicar estilos inline correctos', () => {
      const { container } = render(<CartTotal total={100} />);

      const cartTotalDiv = container.querySelector('.cart-total');
      expect(cartTotalDiv).toHaveStyle('display: flex');
      expect(cartTotalDiv).toHaveStyle('justify-content: flex-end');
      expect(cartTotalDiv).toHaveStyle('margin-top: 12px');
    });

    test('debe renderizar texto "Total:" en elemento span', () => {
      render(<CartTotal total={100} />);

      const totalLabel = screen.getByText('Total:');
      expect(totalLabel.tagName).toBe('SPAN');
    });

    test('debe renderizar precio en elemento strong', () => {
      mockFormatPricePEN.mockReturnValue('S/ 100.00');
      
      render(<CartTotal total={100} />);

      const priceElement = screen.getByText('S/ 100.00');
      expect(priceElement.tagName).toBe('STRONG');
    });
  });

  describe('actualización de props', () => {
    test('debe actualizar cuando cambia el total', () => {
      mockFormatPricePEN
        .mockReturnValueOnce('S/ 100.00')
        .mockReturnValueOnce('S/ 200.00');

      const { rerender } = render(<CartTotal total={100} />);
      
      expect(screen.getByText('S/ 100.00')).toBeInTheDocument();

      rerender(<CartTotal total={200} />);
      
      expect(screen.getByText('S/ 200.00')).toBeInTheDocument();
      expect(screen.queryByText('S/ 100.00')).not.toBeInTheDocument();
      expect(mockFormatPricePEN).toHaveBeenCalledTimes(2);
    });

    test('debe mantener estructura durante re-renders', () => {
      const { rerender, container } = render(<CartTotal total={100} />);

      const initialStructure = container.innerHTML;
      
      rerender(<CartTotal total={100} />);
      
      // La estructura debe mantenerse igual para el mismo total
      expect(container.innerHTML).toBe(initialStructure);
    });
  });

  describe('edge cases', () => {
    test('debe manejar totales negativos si se pasan', () => {
      mockFormatPricePEN.mockReturnValue('S/ -50.00');
      
      render(<CartTotal total={-50} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(-50);
      expect(screen.getByText('S/ -50.00')).toBeInTheDocument();
    });

    test('debe manejar cuando formatPricePEN devuelve string vacío', () => {
      mockFormatPricePEN.mockReturnValue('');
      
      const { container } = render(<CartTotal total={100} />);

      expect(screen.getByText('Total:')).toBeInTheDocument();
      // El strong estará vacío pero debe existir
      expect(container.querySelector('strong')).toBeInTheDocument();
    });

    test('debe manejar valores de total muy precisos', () => {
      const preciseTotal = 123.456789123456;
      mockFormatPricePEN.mockReturnValue('S/ 123.46');
      
      render(<CartTotal total={preciseTotal} />);

      expect(mockFormatPricePEN).toHaveBeenCalledWith(preciseTotal);
    });
  });

  describe('accesibilidad y semántica', () => {
    test('debe tener contenido textual apropiado', () => {
      mockFormatPricePEN.mockReturnValue('S/ 150.00');
      
      render(<CartTotal total={150} />);

      // Verificar que el contenido sea accesible
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText(/S\/ 150\.00/)).toBeInTheDocument();
    });

    test('debe usar elemento strong para enfatizar el precio', () => {
      mockFormatPricePEN.mockReturnValue('S/ 999.99');
      
      render(<CartTotal total={999.99} />);

      const strongElement = screen.getByText('S/ 999.99');
      expect(strongElement.tagName).toBe('STRONG');
    });
  });
});