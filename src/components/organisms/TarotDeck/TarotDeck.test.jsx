import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarotDeck from './TarotDeck';
import { useLocation, useNavigate } from 'react-router';
import apiReading from '../../../services/apiReading';
import apiInterpretation from '../../../services/apiInterpretation';
import useToast from '../../../hooks/useToast';

vi.mock('react-router', () => ({
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
}));

vi.mock('../../../services/apiReading');
vi.mock('../../../services/apiInterpretation');
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
            <button onClick={onClose}>Cerrar Modal</button>
        </div>
    ),
}));

vi.mock('../../molecules/InterpretationModalBackground/InterpretationModalBackground', () => ({
    default: () => <div data-testid="mock-modal-bg" />,
}));

vi.mock('../../../assets/images/flecha_izquierda.png', () => ({ default: 'left-arrow.png' }));
vi.mock('../../../assets/images/flecha_derecha.png', () => ({ default: 'right-arrow.png' }));

describe('TarotDeck Component', () => {
    const mockNavigate = vi.fn();
    const mockCreateReading = vi.fn();
    const mockGenerateInterpretation = vi.fn();
    const mockToastSuccess = vi.fn();
    const mockToastError = vi.fn();

    const mockUser = { id: 'user-777', name: 'Sakura Kinomoto' };

    const mockCardsState = {
        question: '¿Qué me depara el futuro?',
        deckType: 'sakura',
        past: { id: 'c1', spanishName: 'El Viento', sakuraCard: '/viento.png', meaning: 'Fuerza del viento' },
        present: { id: 'c2', spanishName: 'La Sombra', sakuraCard: '/sombra.png', meaning: 'Misterio oculto' },
        future: { id: 'c3', spanishName: 'La Luz', sakuraCard: '/luz.png', meaning: 'Claridad mental' },
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        vi.mocked(apiReading).mockReturnValue({
            createReading: mockCreateReading,
        });

        vi.mocked(apiInterpretation).mockReturnValue({
            generate: mockGenerateInterpretation,
        });

        vi.mocked(useToast).mockReturnValue({
            toast: {
                success: mockToastSuccess,
                error: mockToastError,
            },
        });

        global.innerWidth = 1024;
    });

    describe('Estado Inicial y Ausencia de Datos', () => {
        it('muestra "No hay cartas seleccionadas" si location.state es undefined o null', () => {
            vi.mocked(useLocation).mockReturnValue({ state: null });

            render(<TarotDeck user={mockUser} />);

            expect(screen.getByText(/no hay cartas seleccionadas/i)).toBeInTheDocument();
        });
    });

    describe('Renderizado e Interpretación (Escritorio)', () => {
        beforeEach(() => {
            vi.mocked(useLocation).mockReturnValue({ state: mockCardsState });
        });

        it('obtiene la interpretación automáticamente al montar el componente', async () => {
            mockGenerateInterpretation.mockResolvedValueOnce({
                interpretation: 'Tu destino muestra grandes descubrimientos.',
            });

            render(<TarotDeck user={mockUser} />);

            expect(mockGenerateInterpretation).toHaveBeenCalledWith(
                '¿Qué me depara el futuro?',
                'c1',
                'c2',
                'c3'
            );

            await waitFor(() => {
                expect(
                    screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]
                ).not.toBeDisabled();
            });
        });

        it('muestra mensaje por defecto si la API de interpretación falla', async () => {
            mockGenerateInterpretation.mockRejectedValueOnce(new Error('Error al conectar con la IA'));

            const user = userEvent.setup();
            render(<TarotDeck user={mockUser} />);

            await waitFor(() => {
                expect(
                    screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]
                ).not.toBeDisabled();
            });

            await user.click(screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]);

            expect(
                screen.getByText(/no se pudo generar la interpretación en este momento\./i)
            ).toBeInTheDocument();
        });

        it('renderiza las 3 cartas correctamente en vista de escritorio', async () => {
            mockGenerateInterpretation.mockResolvedValueOnce({ interpretation: 'Interpretación de prueba' });

            render(<TarotDeck user={mockUser} />);

            expect(screen.getAllByText(/el viento/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/la sombra/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/la luz/i)[0]).toBeInTheDocument();

            expect(screen.getAllByText(/fuerza del viento/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/misterio oculto/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/claridad mental/i)[0]).toBeInTheDocument();
        });

        it('abre y cierra el modal de interpretación', async () => {
            const user = userEvent.setup();
            mockGenerateInterpretation.mockResolvedValueOnce({
                interpretation: 'Un camino brillante te aguarda.',
            });

            render(<TarotDeck user={mockUser} />);

            await waitFor(() => {
                expect(
                    screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]
                ).not.toBeDisabled();
            });

            await user.click(screen.getAllByRole('button', { name: /ver la respuesta de las cartas/i })[0]);

            expect(screen.getByRole('heading', { level: 2, name: /la respuesta de las cartas/i })).toBeInTheDocument();
            expect(screen.getByText(/un camino brillante te aguarda\./i)).toBeInTheDocument();

            const closeBtn = screen.getAllByRole('button', { name: /cerrar/i })[0];
            await user.click(closeBtn);

            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
        });
    });

    describe('Flujo de Guardado de Lectura', () => {
        beforeEach(() => {
            vi.mocked(useLocation).mockReturnValue({ state: mockCardsState });
            mockGenerateInterpretation.mockResolvedValue({ interpretation: 'Interpretación guardada' });
        });

        it('muestra un error si se intenta guardar sin un nombre de lectura', async () => {
            const user = userEvent.setup();
            render(<TarotDeck user={mockUser} />);

            await user.click(screen.getByRole('button', { name: /^guardar$/i }));

            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            expect(mockToastError).toHaveBeenCalledWith('Debes introducir un nombre para la partida');
            expect(mockCreateReading).not.toHaveBeenCalled();
        });

        it('guarda la lectura correctamente y navega a /history', async () => {
            const user = userEvent.setup();
            mockCreateReading.mockResolvedValueOnce(true);

            render(<TarotDeck user={mockUser} />);

            await user.click(screen.getByRole('button', { name: /^guardar$/i }));

            const input = screen.getByPlaceholderText(/nombre de la partida/i);
            await user.type(input, 'Lectura Semanal');

            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            expect(mockCreateReading).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: 'user-777',
                    name: 'Lectura Semanal',
                    pastCardId: 'c1',
                    presentCardId: 'c2',
                    futureCardId: 'c3',
                    deckType: 'sakura',
                    question: '¿Qué me depara el futuro?',
                    interpretation: 'Interpretación guardada',
                })
            );

            await waitFor(() => {
                expect(mockToastSuccess).toHaveBeenCalledWith('Lectura guardada correctamente');
                expect(mockNavigate).toHaveBeenCalledWith('/history');
            });
        });

        it('muestra un toast de error si falla la llamada a la API de guardar', async () => {
            const user = userEvent.setup();
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockCreateReading.mockRejectedValueOnce(new Error('Error de servidor'));

            render(<TarotDeck user={mockUser} />);

            await user.click(screen.getByRole('button', { name: /^guardar$/i }));

            const input = screen.getByPlaceholderText(/nombre de la partida/i);
            await user.type(input, 'Mi Lectura');

            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith('Error al guardar la lectura');
                expect(consoleSpy).toHaveBeenCalled();
            });
        });

        it('permite cancelar el guardado al pulsar Cancelar', async () => {
            const user = userEvent.setup();
            render(<TarotDeck user={mockUser} />);

            await user.click(screen.getByRole('button', { name: /^guardar$/i }));
            expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: /cancelar/i }));
            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
        });
    });

    describe('Navegación Táctil / Móvil (pantallas <= 768px)', () => {
        beforeEach(() => {
            global.innerWidth = 375;
            vi.mocked(useLocation).mockReturnValue({ state: mockCardsState });
            mockGenerateInterpretation.mockResolvedValue({ interpretation: 'OK' });
        });

        it('navega secuencialmente entre las cartas usando las flechas', async () => {
            const user = userEvent.setup();
            render(<TarotDeck user={mockUser} />);

            expect(screen.getAllByText(/el viento/i)[0]).toBeInTheDocument();

            expect(screen.queryByRole('img', { name: /izquierda/i })).not.toBeInTheDocument();

            const rightBtn = screen.getByRole('button', { name: /derecha/i });
            await user.click(rightBtn);

            expect(screen.getAllByText(/la sombra/i)[0]).toBeInTheDocument();

            const leftBtn = screen.getByRole('button', { name: /izquierda/i });
            expect(leftBtn).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: /derecha/i }));
            expect(screen.getAllByText(/la luz/i)[0]).toBeInTheDocument();

            expect(screen.queryByRole('img', { name: /derecha/i })).not.toBeInTheDocument();
        });
    });
});