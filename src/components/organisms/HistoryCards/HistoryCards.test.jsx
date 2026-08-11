import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryCards from './HistoryCards';
import apiReading from '../../../services/apiReading';

vi.mock('../../../services/apiReading');

vi.mock('../../molecules/ReadingCard/ReadingCard', () => ({
    default: ({ data, onDelete }) => (
        <div data-testid={`reading-card-${data.id}`}>
            <span>Lectura {data.id}</span>
            <button onClick={onDelete}>Borrar lectura {data.id}</button>
        </div>
    ),
}));

vi.mock('../../molecules/DropButton/DropButton', () => ({
    default: ({ userId, onDelete }) => (
        <button onClick={onDelete}>Vaciar todo el historial ({userId})</button>
    ),
}));

vi.mock('../../atoms/Button/Button', () => ({
    default: ({ text, path }) => <a href={path}>{text}</a>,
}));

describe('HistoryCards Component', () => {
    const mockGetByUserId = vi.fn();
    const mockUserId = 'user-123';

    const scrollToMock = vi.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollToMock, writable: true });

    const createReadingsMock = (count) =>
        Array.from({ length: count }, (_, i) => ({
            id: `reading-${i + 1}`,
            question: `Pregunta ${i + 1}`,
        }));

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(apiReading).mockReturnValue({
            getByUserId: mockGetByUserId,
        });
    });

    describe('Estado Vacío (sin lecturas)', () => {
        it('muestra el mensaje de "no hay lecturas guardadas" cuando la lista está vacía', async () => {
            mockGetByUserId.mockResolvedValueOnce([]);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(mockGetByUserId).toHaveBeenCalledWith(mockUserId);
            });

            expect(
                screen.getByText('No hay lecturas guardadas. Revela ahora tu destino.')
            ).toBeInTheDocument();

            const emptyImg = screen.getByRole('img');
            expect(emptyImg).toHaveAttribute('alt', 'no hay resultados');

            const linkBtn = screen.getByRole('link', { name: 'Inicio' });
            expect(linkBtn).toHaveAttribute('href', '/readings');
        });
    });

    describe('Renderizado y Paginación', () => {
        it('renderiza máximo 15 tarjetas en la primera página sin mostrar controles si totalPages <= 1', async () => {
            const readings = createReadingsMock(10);
            mockGetByUserId.mockResolvedValueOnce(readings);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByTestId('reading-card-reading-1')).toBeInTheDocument();
            });

            expect(screen.getAllByTestId(/^reading-card-/)).toHaveLength(10);

            expect(screen.queryByRole('button', { name: '‹' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: '›' })).not.toBeInTheDocument();
        });

        it('pagina correctamente a 15 elementos por página y muestra controles cuando hay más de 15 lecturas', async () => {
            const user = userEvent.setup();
            const readings = createReadingsMock(20);
            mockGetByUserId.mockResolvedValue(readings);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByTestId('reading-card-reading-1')).toBeInTheDocument();
            });

            expect(screen.getAllByTestId(/^reading-card-/)).toHaveLength(15);

            const page2Btn = screen.getByRole('button', { name: '2' });
            expect(page2Btn).toBeInTheDocument();

            await user.click(page2Btn);

            expect(screen.getAllByTestId(/^reading-card-/)).toHaveLength(5);
            expect(screen.getByTestId('reading-card-reading-16')).toBeInTheDocument();

            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });

        it('deshabilita la flecha anterior en la Pág 1 y la flecha siguiente en la última página', async () => {
            const user = userEvent.setup();
            const readings = createReadingsMock(20);
            mockGetByUserId.mockResolvedValue(readings);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: '‹' })).toBeInTheDocument();
            });

            const prevArrow = screen.getByRole('button', { name: '‹' });
            const nextArrow = screen.getByRole('button', { name: '›' });

            expect(prevArrow).toBeDisabled();
            expect(nextArrow).toBeEnabled();

            await user.click(nextArrow);

            expect(prevArrow).toBeEnabled();
            expect(nextArrow).toBeDisabled();
        });
    });

    describe('Eliminación y Recarga (handleDeleteWithPageCheck)', () => {
        it('recarga la lista al ejecutar onDelete desde ReadingCard', async () => {
            const user = userEvent.setup();
            const initialReadings = createReadingsMock(3);
            const updatedReadings = createReadingsMock(2);

            mockGetByUserId
                .mockResolvedValueOnce(initialReadings)
                .mockResolvedValueOnce(updatedReadings);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByTestId('reading-card-reading-1')).toBeInTheDocument();
            });

            const deleteBtn = screen.getByRole('button', { name: 'Borrar lectura reading-1' });
            await user.click(deleteBtn);

            await waitFor(() => {
                expect(mockGetByUserId).toHaveBeenCalledTimes(2);
            });
        });

        it('retrocede automáticamente de página si se elimina el único elemento de la página actual', async () => {
            const user = userEvent.setup();
            const readingsPage1 = createReadingsMock(16);
            const readingsPage1AfterDelete = createReadingsMock(15);

            mockGetByUserId
                .mockResolvedValueOnce(readingsPage1)
                .mockResolvedValueOnce(readingsPage1AfterDelete);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
            });

            await user.click(screen.getByRole('button', { name: '2' }));
            expect(screen.getAllByTestId(/^reading-card-/)).toHaveLength(1);

            const deleteBtn = screen.getByRole('button', { name: 'Borrar lectura reading-16' });
            await user.click(deleteBtn);

            await waitFor(() => {
                expect(screen.getAllByTestId(/^reading-card-/)).toHaveLength(15);
            });
        });

        it('dispara la recarga de datos al pulsar el botón de vaciar todo (DropButton)', async () => {
            const user = userEvent.setup();
            mockGetByUserId
                .mockResolvedValueOnce(createReadingsMock(3))
                .mockResolvedValueOnce([]);

            render(<HistoryCards userId={mockUserId} />);

            await waitFor(() => {
                expect(screen.getByTestId('reading-card-reading-1')).toBeInTheDocument();
            });

            const dropAllBtn = screen.getByRole('button', { name: `Vaciar todo el historial (${mockUserId})` });
            await user.click(dropAllBtn);

            await waitFor(() => {
                expect(
                    screen.getByText('No hay lecturas guardadas. Revela ahora tu destino.')
                ).toBeInTheDocument();
            });
        });
    });
});