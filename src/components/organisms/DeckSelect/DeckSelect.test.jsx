import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import DeckSelect from './DeckSelect';

const mockNavigate = vi.fn();
const mockSetTheme = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../hooks/useTheme', () => ({
    default: () => ({ theme: 'sakura', setTheme: mockSetTheme }),
}));

const renderDeckSelect = () =>
    render(
        <MemoryRouter>
            <DeckSelect />
        </MemoryRouter>
    );

describe('DeckSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza las dos opciones de mazo', () => {
        renderDeckSelect();

        expect(screen.getByText(/cartas sakura/i)).toBeInTheDocument();
        expect(screen.getByText(/cartas clow/i)).toBeInTheDocument();
    });

    it('al elegir el mazo Sakura, activa el tema claro y navega con el deckType correcto', async () => {
        const user = userEvent.setup();
        renderDeckSelect();

        await user.click(screen.getByText(/cartas sakura/i));

        expect(mockSetTheme).toHaveBeenCalledWith('sakura');
        expect(mockNavigate).toHaveBeenCalledWith(
            '/readings/question',
            { state: { deckType: 'SAKURA' } }
        );
    });

    it('al elegir el mazo Clow, activa el tema oscuro y navega con el deckType correcto', async () => {
        const user = userEvent.setup();
        renderDeckSelect();

        await user.click(screen.getByText(/cartas clow/i));

        expect(mockSetTheme).toHaveBeenCalledWith('clow');
        expect(mockNavigate).toHaveBeenCalledWith(
            '/readings/question',
            { state: { deckType: 'CLOW' } }
        );
    });
});