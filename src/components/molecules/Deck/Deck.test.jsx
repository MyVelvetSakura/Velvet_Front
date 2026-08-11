import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Deck from './Deck';

describe('Deck Component', () => {
    const mockDeck = [
        { id: 'card-1', sakuraReverse: '/img/reverse1.png' },
        { id: 'card-2', sakuraReverse: '/img/reverse2.png' },
    ];

    const defaultProps = {
        deck: mockDeck,
        onCardClick: vi.fn(),
        onShuffle: vi.fn(),
        placeCard: vi.fn(),
        slots: {},
    };

    let audioPlayMock;

    beforeEach(() => {
        vi.useFakeTimers();

        audioPlayMock = vi.fn().mockResolvedValue(undefined);

        vi.stubGlobal(
            'Audio',
            vi.fn().mockImplementation(function () {
                this.play = audioPlayMock;
                this.volume = 1;
                return this;
            })
        );
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('renderiza la cantidad correcta de cartas en ambas secciones (móvil y desktop)', () => {
        render(<Deck {...defaultProps} />);

        const mobileCards = screen.getAllByAltText('Reverse card');
        const desktopCards = screen.getAllByAltText('Reverso');

        expect(mobileCards).toHaveLength(mockDeck.length);
        expect(desktopCards).toHaveLength(mockDeck.length);
    });

    describe('Mecanismo de Barajado', () => {
        it('inicia el proceso de barajar, reproduce sonido y llama a onShuffle', () => {
            render(<Deck {...defaultProps} />);

            const shuffleBtn = screen.getByRole('button', { name: /barajar/i });
            fireEvent.click(shuffleBtn);

            expect(global.Audio).toHaveBeenCalled();
            expect(audioPlayMock).toHaveBeenCalledTimes(1);
            expect(defaultProps.onShuffle).toHaveBeenCalledTimes(1);
            expect(shuffleBtn).toBeDisabled();
        });

        it('restablece el estado de barajado tras 800ms', () => {
            render(<Deck {...defaultProps} />);

            const shuffleBtn = screen.getByRole('button', { name: /barajar/i });
            fireEvent.click(shuffleBtn);

            expect(shuffleBtn).toBeDisabled();

            act(() => {
                vi.advanceTimersByTime(800);
            });

            expect(shuffleBtn).not.toBeDisabled();
        });
    });

    describe('Selección de Cartas', () => {
        it('llama a onCardClick tras 300ms al pulsar una carta en versión móvil', () => {
            render(<Deck {...defaultProps} />);

            const mobileCards = screen.getAllByAltText('Reverse card');
            const targetCardContainer = mobileCards[0].closest('div');

            fireEvent.click(targetCardContainer);

            expect(defaultProps.onCardClick).not.toHaveBeenCalled();
            expect(targetCardContainer.className).toMatch(/card_ghost/);

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(defaultProps.onCardClick).toHaveBeenCalledWith(mockDeck[0]);
            expect(targetCardContainer.className).not.toMatch(/card_ghost/);
        });

        it('llama inmediatamente a placeCard al pulsar una carta en versión desktop', () => {
            render(<Deck {...defaultProps} />);

            const desktopCards = screen.getAllByAltText('Reverso');
            fireEvent.click(desktopCards[1].closest('div'));

            expect(defaultProps.placeCard).toHaveBeenCalledTimes(1);
            expect(defaultProps.placeCard).toHaveBeenCalledWith(mockDeck[1]);
        });
    });

    describe('Mazo Deshabilitado (slots llenos)', () => {
        const fullSlots = { past: 'card1', present: 'card2', future: 'card3' };

        it('no ejecuta la selección móvil si todos los slots están ocupados', () => {
            render(<Deck {...defaultProps} slots={fullSlots} />);

            const mobileCards = screen.getAllByAltText('Reverse card');
            fireEvent.click(mobileCards[0].closest('div'));

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(defaultProps.onCardClick).not.toHaveBeenCalled();
        });

        it('no ejecuta placeCard en desktop si todos los slots están ocupados', () => {
            render(<Deck {...defaultProps} slots={fullSlots} />);

            const desktopCards = screen.getAllByAltText('Reverso');
            fireEvent.click(desktopCards[0].closest('div'));

            expect(defaultProps.placeCard).not.toHaveBeenCalled();
        });
    });
});