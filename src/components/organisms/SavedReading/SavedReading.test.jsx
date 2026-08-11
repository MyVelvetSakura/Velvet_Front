import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavedReading from './SavedReading';
import { useLocation, useNavigate } from 'react-router';
import { apiSakura } from '../../../services/api';
import apiReading from '../../../services/apiReading';
import useToast from '../../../hooks/useToast';

vi.mock('react-router', () => ({
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
}));

vi.mock('../../../services/api');
vi.mock('../../../services/apiReading');
vi.mock('../../../hooks/useToast');

vi.mock('../../atoms/Button/Button', () => ({
    default: ({ text, path, onClick }) => (
        <button onClick={onClick} data-path={path}>
            {text}
        </button>
    ),
}));

vi.mock('../../molecules/Modal/Modal', () => ({
    default: ({ title, children, actions, onClose }) => (
        <div data-testid="mock-modal">
            <h2>{title}</h2>
            <div>{children}</div>
            <div>{actions}</div>
            <button onClick={onClose}>Cerrar</button>
        </div>
    ),
}));

vi.mock('../../molecules/InterpretationModalBackground/InterpretationModalBackground', () => ({
    default: () => <div data-testid="mock-modal-bg" />,
}));

describe('SavedReading Component', () => {
    const mockNavigate = vi.fn();
    const mockGetCardById = vi.fn();
    const mockGetById = vi.fn();
    const mockDeleteReading = vi.fn();
    const mockToastSuccess = vi.fn();
    const mockToastError = vi.fn();

    const mockState = {
        id: 'reading-123',
        past: 'c1',
        present: 'c2',
        future: 'c3',
    };

    const mockCardsMap = {
        c1: { id: 'c1', spanishName: 'Luz', sakuraCard: '/luz.png', meaning: 'Significado de Luz' },
        c2: { id: 'c2', spanishName: 'Sombra', sakuraCard: '/sombra.png', meaning: 'Significado de Sombra' },
        c3: { id: 'c3', spanishName: 'Viento', sakuraCard: '/viento.png', meaning: 'Significado de Viento' },
    };

    const mockReadingData = {
        id: 'reading-123',
        interpretation: 'Esta es la interpretación de las cartas',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        vi.mocked(apiSakura).mockReturnValue({
            getCardById: mockGetCardById.mockImplementation((id) => Promise.resolve(mockCardsMap[id])),
        });

        vi.mocked(apiReading).mockReturnValue({
            getById: mockGetById.mockResolvedValue(mockReadingData),
            deleteReading: mockDeleteReading,
        });

        vi.mocked(useToast).mockReturnValue({
            toast: {
                success: mockToastSuccess,
                error: mockToastError,
            },
        });

        global.innerWidth = 1024;
    });

    describe('Estado de Carga y Acceso Directo', () => {
        it('muestra "Cargando lectura..." si location.state es undefined', () => {
            vi.mocked(useLocation).mockReturnValue({ state: null });

            render(<SavedReading />);

            expect(screen.getAllByText(/cargando lectura\.\.\./i)[0]).toBeInTheDocument();
        });

        it('muestra "Cargando lectura..." mientras se resuelven las promesas de las cartas', () => {
            vi.mocked(useLocation).mockReturnValue({ state: mockState });
            mockGetCardById.mockReturnValue(new Promise(() => {}));

            render(<SavedReading />);

            expect(screen.getAllByText(/cargando lectura\.\.\./i)[0]).toBeInTheDocument();
        });
    });

    describe('Renderizado e Interacción en Desktop', () => {
        beforeEach(() => {
            vi.mocked(useLocation).mockReturnValue({ state: mockState });
        });

        it('carga y renderiza las 3 cartas (Pasado, Presente, Futuro) y el botón de interpretación', async () => {
            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByText(/luz/i)[0]).toBeInTheDocument();
            });

            expect(screen.getAllByText(/sombra/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/viento/i)[0]).toBeInTheDocument();

            expect(screen.getAllByText(/significado de luz/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/significado de sombra/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/significado de viento/i)[0]).toBeInTheDocument();

            expect(
                screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]
            ).toBeInTheDocument();
        });

        it('abre y cierra el modal con la interpretación de la lectura', async () => {
            const user = userEvent.setup();
            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByText(/luz/i)[0]).toBeInTheDocument();
            });

            const openModalBtn = screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0];
            await user.click(openModalBtn);

            expect(screen.getByRole('heading', { level: 2, name: /la respuesta de las cartas/i })).toBeInTheDocument();
            expect(screen.getAllByText(/esta es la interpretación de las cartas/i)[0]).toBeInTheDocument();

            const closeBtn = screen.getAllByRole('button', { name: /cerrar|x/i })[0];
            await user.click(closeBtn);

            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
        });
    });

    describe('Flujo de Eliminación de Lectura', () => {
        beforeEach(() => {
            vi.mocked(useLocation).mockReturnValue({ state: mockState });
        });

        it('abre el modal de confirmación y elimina la lectura con éxito', async () => {
            const user = userEvent.setup();
            mockDeleteReading.mockResolvedValueOnce(true);

            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
            });

            await user.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);

            expect(screen.getByRole('heading', { level: 2, name: /¿eliminar esta lectura\?/i })).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            expect(mockDeleteReading).toHaveBeenCalledWith('reading-123');
            await waitFor(() => {
                expect(mockToastSuccess).toHaveBeenCalledWith('Lectura eliminada');
                expect(mockNavigate).toHaveBeenCalledWith('/history', { replace: true });
            });
        });

        it('cancela la eliminación al hacer clic en Cancelar dentro del modal', async () => {
            const user = userEvent.setup();
            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
            });

            await user.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);
            await user.click(screen.getByRole('button', { name: /cancelar/i }));

            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
            expect(mockDeleteReading).not.toHaveBeenCalled();
        });

        it('muestra un toast de error si la API de eliminación falla', async () => {
            const user = userEvent.setup();
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockDeleteReading.mockRejectedValueOnce(new Error('API Error'));

            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
            });

            await user.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);
            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith('Error al eliminar la lectura');
                expect(consoleSpy).toHaveBeenCalled();
            });
        });
    });

    describe('Navegación Móvil (pantallas <= 768px)', () => {
        beforeEach(() => {
            global.innerWidth = 375;
            vi.mocked(useLocation).mockReturnValue({ state: mockState });
        });

        it('permite avanzar y retroceder entre las cartas mediante las flechas', async () => {
            const user = userEvent.setup();
            render(<SavedReading />);

            await waitFor(() => {
                expect(screen.getAllByText(/luz/i)[0]).toBeInTheDocument();
            });

            expect(screen.queryByRole('img', { name: /izquierda/i })).not.toBeInTheDocument();
            const rightArrow = screen.getByRole('button', { name: /derecha/i });

            await user.click(rightArrow);
            expect(screen.getAllByText(/sombra/i)[0]).toBeInTheDocument();

            const leftArrow = screen.getByRole('button', { name: /izquierda/i });
            expect(leftArrow).toBeInTheDocument();

            await user.click(leftArrow);
            expect(screen.getAllByText(/luz/i)[0]).toBeInTheDocument();
        });
    });
});