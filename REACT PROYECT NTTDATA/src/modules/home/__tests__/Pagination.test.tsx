// Pagination.jest.test.tsx - Test unitario para Pagination
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Pagination from '@/modules/home/components/Pagination';

describe('Pagination Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado básico', () => {
    test('debe renderizar correctamente con múltiples páginas', () => {
      render(<Pagination page={1} totalPages={5} onChange={mockOnChange} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '← Anterior' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeInTheDocument();
      
      // Verifica que aparecen las primeras páginas (máximo 7)
      expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 5' })).toBeInTheDocument();
    });

    test('no debe renderizar nada cuando totalPages es 1', () => {
      const { container } = render(<Pagination page={1} totalPages={1} onChange={mockOnChange} />);

      expect(container.firstChild).toBeNull();
    });

    test('no debe renderizar nada cuando totalPages es 0', () => {
      const { container } = render(<Pagination page={1} totalPages={0} onChange={mockOnChange} />);

      expect(container.firstChild).toBeNull();
    });

    test('debe renderizar máximo 7 páginas cuando hay más de 7 páginas totales', () => {
      render(<Pagination page={1} totalPages={10} onChange={mockOnChange} />);

      // Solo deben aparecer las primeras 7 páginas
      expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 7' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Página 8' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Página 10' })).not.toBeInTheDocument();
    });
  });

  describe('página activa', () => {
    test('debe marcar la página actual como activa', () => {
      render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

      const activePage = screen.getByRole('button', { name: 'Página 3' });
      expect(activePage).toHaveClass('pager-page', 'is-active');
    });

    test('debe mostrar solo una página como activa', () => {
      render(<Pagination page={2} totalPages={5} onChange={mockOnChange} />);

      const page1 = screen.getByRole('button', { name: 'Página 1' });
      const page2 = screen.getByRole('button', { name: 'Página 2' });
      const page3 = screen.getByRole('button', { name: 'Página 3' });

      expect(page1).not.toHaveClass('is-active');
      expect(page2).toHaveClass('is-active');
      expect(page3).not.toHaveClass('is-active');
    });
  });

  describe('botón anterior', () => {
    test('debe estar habilitado cuando no estamos en la primera página', () => {
      render(<Pagination page={2} totalPages={5} onChange={mockOnChange} />);

      const previousButton = screen.getByRole('button', { name: '← Anterior' });
      expect(previousButton).not.toBeDisabled();
    });

    test('debe estar deshabilitado cuando estamos en la primera página', () => {
      render(<Pagination page={1} totalPages={5} onChange={mockOnChange} />);

      const previousButton = screen.getByRole('button', { name: '← Anterior' });
      expect(previousButton).toBeDisabled();
    });

    test('debe llamar onChange con página anterior al hacer click', async () => {
      const user = userEvent.setup();
      render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

      const previousButton = screen.getByRole('button', { name: '← Anterior' });
      await user.click(previousButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(2);
    });
  });

  describe('botón siguiente', () => {
    test('debe estar habilitado cuando no estamos en la última página', () => {
      render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

      const nextButton = screen.getByRole('button', { name: 'Siguiente →' });
      expect(nextButton).not.toBeDisabled();
    });

    test('debe estar deshabilitado cuando estamos en la última página', () => {
      render(<Pagination page={5} totalPages={5} onChange={mockOnChange} />);

      const nextButton = screen.getByRole('button', { name: 'Siguiente →' });
      expect(nextButton).toBeDisabled();
    });

    test('debe llamar onChange con página siguiente al hacer click', async () => {
      const user = userEvent.setup();
      render(<Pagination page={2} totalPages={5} onChange={mockOnChange} />);

      const nextButton = screen.getByRole('button', { name: 'Siguiente →' });
      await user.click(nextButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(3);
    });
  });

  describe('navegación por páginas específicas', () => {
    test('debe llamar onChange con el número de página al hacer click en una página', async () => {
      const user = userEvent.setup();
      render(<Pagination page={1} totalPages={5} onChange={mockOnChange} />);

      const page4Button = screen.getByRole('button', { name: 'Página 4' });
      await user.click(page4Button);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    test('debe permitir hacer click en cualquier página visible', async () => {
      const user = userEvent.setup();
      render(<Pagination page={3} totalPages={7} onChange={mockOnChange} />);

      // Click en diferentes páginas
      await user.click(screen.getByRole('button', { name: 'Página 1' }));
      expect(mockOnChange).toHaveBeenCalledWith(1);

      await user.click(screen.getByRole('button', { name: 'Página 7' }));
      expect(mockOnChange).toHaveBeenCalledWith(7);

      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('estructura HTML y CSS', () => {
    test('debe tener la estructura de clases CSS correcta', () => {
      const { container } = render(<Pagination page={2} totalPages={5} onChange={mockOnChange} />);

      expect(container.querySelector('nav.pager')).toBeInTheDocument();
      expect(container.querySelector('.pager-nav')).toBeInTheDocument();
      expect(container.querySelector('.pager-page')).toBeInTheDocument();
      expect(container.querySelector('.pager-page.is-active')).toBeInTheDocument();
    });

    test('debe usar el elemento nav para accesibilidad', () => {
      render(<Pagination page={1} totalPages={3} onChange={mockOnChange} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('pager');
    });
  });

  describe('casos edge', () => {
    test('debe manejar totalPages = 2 correctamente', () => {
      render(<Pagination page={1} totalPages={2} onChange={mockOnChange} />);

      expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Página 3' })).not.toBeInTheDocument();
    });

    test('debe funcionar correctamente cuando page está al final del rango', () => {
      render(<Pagination page={7} totalPages={7} onChange={mockOnChange} />);

      const nextButton = screen.getByRole('button', { name: 'Siguiente →' });
      const previousButton = screen.getByRole('button', { name: '← Anterior' });

      expect(nextButton).toBeDisabled();
      expect(previousButton).not.toBeDisabled();
    });

    test('debe manejar props de página inválida gracefully (página 0)', () => {
      const { container } = render(<Pagination page={0} totalPages={5} onChange={mockOnChange} />);

      // El componente debería funcionar, aunque page sea 0
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      const activePage = container.querySelector('.pager-page.is-active');
      expect(activePage).toBeNull(); // No hay página activa válida
    });

    test('debe manejar props de página inválida gracefully (página > totalPages)', () => {
      const { container } = render(<Pagination page={10} totalPages={5} onChange={mockOnChange} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      // No debería haber página activa ya que page > totalPages
      const activePage = container.querySelector('.pager-page.is-active');
      expect(activePage).toBeNull();
    });
  });

  describe('interacciones múltiples', () => {
    test('debe manejar múltiples clicks correctamente', async () => {
      const user = userEvent.setup();
      render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

      // Click anterior varias veces (cada click desde la misma página base)
      const previousButton = screen.getByRole('button', { name: '← Anterior' });
      await user.click(previousButton);
      await user.click(previousButton);

      expect(mockOnChange).toHaveBeenCalledTimes(2);
      // Ambas llamadas serán con página 2 porque el componente no actualiza internamente
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 2);
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 2);
    });

    test('debe permitir alternar entre anterior y siguiente', async () => {
      const user = userEvent.setup();
      render(<Pagination page={3} totalPages={5} onChange={mockOnChange} />);

      const previousButton = screen.getByRole('button', { name: '← Anterior' });
      const nextButton = screen.getByRole('button', { name: 'Siguiente →' });

      await user.click(nextButton);
      await user.click(previousButton);

      expect(mockOnChange).toHaveBeenCalledTimes(2);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 4);
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 2);
    });
  });
});