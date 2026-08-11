import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BoardCards from './BoardCards';
import { useNavigate } from 'react-router';
import { apiSakura } from '../../../services/api';
import apiProgress from '../../../services/apiProgress';
import useToast from '../../../hooks/useToast';

vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../../services/api');
vi.mock('../../../services/apiProgress');
vi.mock('../../../hooks/useToast');

vi.mock('../../molecules/Deck/Deck', () => ({
    default: ({ onCardClick, deck }) => (
        <div data-testid="mock-deck">
            {deck.map((card) => (
                <button
                    key={card.id}
                    onClick={() => onCardClick(card)}
                >
                    Elegir {card.name}
                </button>
            ))}
        </div>
    ),
}));

describe('BoardCards Component', () => {
    const mockNavigate = vi.fn();
    const mockGetDeck = vi.fn();
    const mockSpendForRetry = vi.fn();
    const mockToastSuccess = vi.fn();
    const mockToastError = vi.fn();

    const mockUser = { id: 'user-777', name: 'Sakura' };
    const mockDeckType = 'sakura';
    const mockQuestion = '¿Tendré éxito en mi examen?';

    const mockCardsData = [
        { id: 'c1', name: 'The Light', sakuraCard: '/light.png', sakuraReverse: '/back.png' },
        { id: 'c2', name: 'The Dark', sakuraCard: '/dark.png', sakuraReverse: '/back.png' },
        { id: 'c3', name: 'The Shadow', sakuraCard: '/shadow.png', sakuraReverse: '/back.png' },
        { id: 'c4', name: 'The Windy', sakuraCard: '/windy.png', sakuraReverse: '/back.png' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        vi.mocked(apiSakura).mockReturnValue({
            getDeck: mockGetDeck.mockResolvedValue(mockCardsData),
        });

        vi.mocked(apiProgress).mockReturnValue({
            spendForRetry: mockSpendForRetry,
        });

        vi.mocked(useToast).mockReturnValue({
            toast: {
                success: mockToastSuccess,
                error: mockToastError,
            },
        });
    });

    describe('Carga inicial del mazo', () => {
        it('llama a apiSakura con el deckType y renderiza el mazo filtrando duplicados', async () => {
            const duplicateCardsData = [
                ...mockCardsData,
                { id: 'c1', name: 'The Light Duplicada', sakuraCard: '/light.png', sakuraReverse: '/back.png' },
            ];
            mockGetDeck.mockResolvedValueOnce(duplicateCardsData);

            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            expect(mockGetDeck).toHaveBeenCalledWith(mockDeckType);

            await waitFor(() => {
                const cardButtons = screen.getAllByRole('button', { name: /Elegir/i });
                expect(cardButtons).toHaveLength(4);
            });
        });

        it('gestiona el error si la llamada a apiSakura falla', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockGetDeck.mockRejectedValueOnce(new Error('Network error'));

            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error cargando el mazo:', expect.any(Error));
            });
        });
    });

    describe('Colocación de cartas en los slots (Pasado, Presente, Futuro)', () => {
        it('mantiene deshabilitado el botón "Revelar" mientras no se hayan ocupado los 3 slots', async () => {
            const user = userEvent.setup();
            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Elegir The Light' })).toBeInTheDocument();
            });

            const revealBtn = screen.getByRole('button', { name: 'Revelar' });
            expect(revealBtn).toBeDisabled();

            await user.click(screen.getByRole('button', { name: 'Elegir The Light' }));
            expect(revealBtn).toBeDisabled();

            await user.click(screen.getByRole('button', { name: 'Elegir The Dark' }));
            expect(revealBtn).toBeDisabled();

            await user.click(screen.getByRole('button', { name: 'Elegir The Shadow' }));
            expect(revealBtn).toBeEnabled();
        });

        it('coloca las cartas secuencialmente en Pasado, Presente y Futuro', async () => {
            const user = userEvent.setup();
            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Elegir The Light' })).toBeInTheDocument();
            });

            await user.click(screen.getByRole('button', { name: 'Elegir The Light' }));
            expect(screen.getByAltText('Pasado')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Elegir The Dark' }));
            expect(screen.getByAltText('Presente')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Elegir The Shadow' }));
            expect(screen.getByAltText('Futuro')).toBeInTheDocument();
        });
    });

    describe('Flujo de Revelado y Navegación al Resultado', () => {
        it('revela las cartas al hacer clic en "Revelar" y cambia el botón a "Continuar"', async () => {
            const user = userEvent.setup();
            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Elegir The Light' })).toBeInTheDocument();
            });

            await user.click(screen.getByRole('button', { name: 'Elegir The Light' }));
            await user.click(screen.getByRole('button', { name: 'Elegir The Dark' }));
            await user.click(screen.getByRole('button', { name: 'Elegir The Shadow' }));

            const actionBtn = screen.getByRole('button', { name: 'Revelar' });
            await user.click(actionBtn);

            expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
        });

        it('navega a "/tarot-result" con el estado correspondiente al pulsar "Continuar"', async () => {
            const user = userEvent.setup();
            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Elegir The Light' })).toBeInTheDocument();
            });

            await user.click(screen.getByRole('button', { name: 'Elegir The Light' }));
            await user.click(screen.getByRole('button', { name: 'Elegir The Dark' }));
            await user.click(screen.getByRole('button', { name: 'Elegir The Shadow' }));

            await user.click(screen.getByRole('button', { name: 'Revelar' }));

            await user.click(screen.getByRole('button', { name: 'Continuar' }));

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/tarot-result', {
                state: {
                    past: mockCardsData[0],
                    present: mockCardsData[1],
                    future: mockCardsData[2],
                    deckType: mockDeckType,
                    question: mockQuestion,
                },
            });
        });
    });

    describe('Reinicio de Tirada (resetGame)', () => {
        it('reinicia la tirada con éxito descontando Plumas de Yue', async () => {
            const user = userEvent.setup();
            mockSpendForRetry.mockResolvedValueOnce(true);

            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Elegir The Light' })).toBeInTheDocument();
            });

            await user.click(screen.getByRole('button', { name: 'Elegir The Light' }));
            expect(screen.getByAltText('Pasado')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Reiniciar' }));

            expect(mockSpendForRetry).toHaveBeenCalledWith(mockUser.id);

            await waitFor(() => {
                expect(screen.queryByAltText('Pasado')).not.toBeInTheDocument();
                expect(mockToastSuccess).toHaveBeenCalledWith('Tirada reiniciada. -15 🪶');
            });
        });

        it('muestra un toast de error si el usuario no tiene suficientes plumas', async () => {
            const user = userEvent.setup();
            mockSpendForRetry.mockResolvedValueOnce(false);

            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await user.click(screen.getByRole('button', { name: 'Reiniciar' }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Necesitas 15 Plumas de Yue para reiniciar la tirada'
                );
            });
        });

        it('muestra toast de error si falla la llamada a apiProgress', async () => {
            const user = userEvent.setup();
            mockSpendForRetry.mockRejectedValueOnce(new Error('Server error'));

            render(
                <BoardCards
                    deckType={mockDeckType}
                    question={mockQuestion}
                    user={mockUser}
                />
            );

            await user.click(screen.getByRole('button', { name: 'Reiniciar' }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith('No se pudo procesar el reinicio');
            });
        });
    });
});