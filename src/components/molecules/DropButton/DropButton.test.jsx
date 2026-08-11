import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropButton from './DropButton';
import apiReading from '../../../services/apiReading';
import useToast from '../../../hooks/useToast';

vi.mock('../../../services/apiReading');
vi.mock('../../../hooks/useToast');

describe('DropButton Component', () => {
    const mockDeleteAllByUserId = vi.fn();
    const mockToastSuccess = vi.fn();
    const mockToastError = vi.fn();
    const mockOnDelete = vi.fn();
    const testUserId = 'user-456';

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(apiReading).mockReturnValue({
            deleteAllByUserId: mockDeleteAllByUserId,
        });

        vi.mocked(useToast).mockReturnValue({
            toast: {
                success: mockToastSuccess,
                error: mockToastError,
            },
        });
    });

    it('renderiza únicamente el botón de borrar historial por defecto', () => {
        render(<DropButton userId={testUserId} onDelete={mockOnDelete} />);

        expect(screen.getByRole('button', { name: /borrar historial/i })).toBeInTheDocument();

        expect(screen.queryByText('¿Borrar todo el historial?')).not.toBeInTheDocument();
    });

    it('abre el modal de confirmación al hacer clic en el botón', async () => {
        const user = userEvent.setup();
        render(<DropButton userId={testUserId} onDelete={mockOnDelete} />);

        await user.click(screen.getByRole('button', { name: /borrar historial/i }));

        expect(screen.getByText('¿Borrar todo el historial?')).toBeInTheDocument();
        expect(
            screen.getByText('Se eliminarán todas tus lecturas guardadas. Esta acción no se puede deshacer.')
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('cierra el modal si el usuario hace clic en Cancelar sin llamar a la API', async () => {
        const user = userEvent.setup();
        render(<DropButton userId={testUserId} onDelete={mockOnDelete} />);

        await user.click(screen.getByRole('button', { name: /borrar historial/i }));
        await user.click(screen.getByRole('button', { name: /cancelar/i }));

        expect(screen.queryByText('¿Borrar todo el historial?')).not.toBeInTheDocument();
        expect(mockDeleteAllByUserId).not.toHaveBeenCalled();
    });

    describe('Confirmación de borrado completo', () => {
        it('borra con éxito: ejecuta la API con el userId, cierra el modal, muestra toast y llama a onDelete', async () => {
            const user = userEvent.setup();
            mockDeleteAllByUserId.mockResolvedValueOnce({});

            render(<DropButton userId={testUserId} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: /borrar historial/i }));
            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            expect(mockDeleteAllByUserId).toHaveBeenCalledTimes(1);
            expect(mockDeleteAllByUserId).toHaveBeenCalledWith(testUserId);

            await waitFor(() => {
                expect(screen.queryByText('¿Borrar todo el historial?')).not.toBeInTheDocument();
                expect(mockToastSuccess).toHaveBeenCalledWith('Historial borrado');
                expect(mockOnDelete).toHaveBeenCalledTimes(1);
            });
        });

        it('gestiona el error de la API: muestra el toast de error y no ejecuta onDelete', async () => {
            const user = userEvent.setup();
            vi.spyOn(console, 'error').mockImplementation(() => {});

            mockDeleteAllByUserId.mockRejectedValueOnce(new Error('Server Error'));

            render(<DropButton userId={testUserId} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: /borrar historial/i }));
            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith('No se pudo borrar el historial');
                expect(mockOnDelete).not.toHaveBeenCalled();
            });
        });
    });
});