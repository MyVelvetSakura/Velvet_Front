import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import AskQuestion from './AskQuestion';

const mockNavigate = vi.fn();
const mockToastError = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useToast', () => ({
    default: () => ({ toast: { error: mockToastError, success: vi.fn() } }),
}));

const renderWithDeckType = (deckType = 'SAKURA') =>
    render(
        <MemoryRouter
            initialEntries={[{ pathname: '/readings/question', state: { deckType } }]}
        >
            <Routes>
                <Route path="/readings/question" element={<AskQuestion />} />
            </Routes>
        </MemoryRouter>
    );

describe('AskQuestion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza el textarea y ambos botones cuando hay un deckType válido', () => {
        renderWithDeckType('SAKURA');

        expect(screen.getByPlaceholderText(/qué camino debo seguir/i)).toBeInTheDocument();
        expect(screen.getByText('Continuar')).toBeInTheDocument();
        expect(screen.getByText('Prefiero no preguntar')).toBeInTheDocument();
    });

    it('redirige a /readings si no hay deckType en el state', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/readings/question', state: null }]}>
                <Routes>
                    <Route path="/readings/question" element={<AskQuestion />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/readings', { replace: true });
    });

    it('muestra un error si se intenta continuar sin escribir ninguna pregunta', async () => {
        const user = userEvent.setup();
        renderWithDeckType('SAKURA');

        await user.click(screen.getByText('Continuar'));

        expect(mockToastError).toHaveBeenCalledWith('Escribe tu pregunta antes de continuar');
        expect(mockNavigate).not.toHaveBeenCalledWith('/readings/board', expect.anything());
    });

    it('navega a /readings/board con la pregunta y el deckType al continuar', async () => {
        const user = userEvent.setup();
        renderWithDeckType('CLOW');

        await user.type(
            screen.getByPlaceholderText(/qué camino debo seguir/i),
            '¿Cómo será mi semana?'
        );
        await user.click(screen.getByText('Continuar'));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/readings/board',
            { state: { deckType: 'CLOW', question: '¿Cómo será mi semana?' } }
        );
    });

    it('navega a /readings/board sin pregunta al pulsar "Prefiero no preguntar"', async () => {
        const user = userEvent.setup();
        renderWithDeckType('SAKURA');

        await user.click(screen.getByText('Prefiero no preguntar'));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/readings/board',
            { state: { deckType: 'SAKURA', question: '' } }
        );
    });

    it('recorta espacios en blanco al inicio/final de la pregunta antes de navegar', async () => {
        const user = userEvent.setup();
        renderWithDeckType('SAKURA');

        await user.type(
            screen.getByPlaceholderText(/qué camino debo seguir/i),
            '   pregunta con espacios   '
        );
        await user.click(screen.getByText('Continuar'));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/readings/board',
            { state: { deckType: 'SAKURA', question: 'pregunta con espacios' } }
        );
    });
});