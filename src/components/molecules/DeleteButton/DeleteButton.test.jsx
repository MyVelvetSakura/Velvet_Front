import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteButton from './DeleteButton';
import apiReading from '../../../services/apiReading';
import useToast from '../../../hooks/useToast';

vi.mock('../../../services/apiReading');
vi.mock('../../../hooks/useToast');

describe('DeleteButton Component', () => {
    const mockDeleteReading = vi.fn();
    const mockToastSuccess = vi.fn();
    const mockToastError = vi.fn();
    const mockOnDelete = vi.fn();
    const testId = 'reading-123';

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(apiReading).mockReturnValue({
            deleteReading: mockDeleteReading,
        });

        vi.mocked(useToast).mockReturnValue({
            toast: {
                success: mockToastSuccess,
                error: mockToastError,
            },
        });
    });

    it('renderiza únicamente el botón de eliminar por defecto', () => {
        render(<DeleteButton id={testId} onDelete={mockOnDelete} />);

        expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();

        expect(screen.queryByText('¿Eliminar esta lectura?')).not.toBeInTheDocument();
    });

    it('abre el modal de confirmación al hacer clic en el botón Eliminar', async () => {
        const user = userEvent.setup();
        render(<DeleteButton id={testId} onDelete={mockOnDelete} />);

        await user.click(screen.getByRole('button', { name: /eliminar/i }));

        expect(screen.getByText('¿Eliminar esta lectura?')).toBeInTheDocument();
        expect(screen.getByText('Esta acción no se puede deshacer.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('cierra el modal si se pulsa en Cancelar sin llamar a la API', async () => {
        const user = userEvent.setup();
        render(<DeleteButton id={testId} onDelete={mockOnDelete} />);

        await user.click(screen.getByRole('button', { name: /eliminar/i }));
        
        await user.click(screen.getByRole('button', { name: /cancelar/i }));

        expect(screen.queryByText('¿Eliminar esta lectura?')).not.toBeInTheDocument();
        expect(mockDeleteReading).not.toHaveBeenCalled();
    });

    describe('Confirmación de borrado', () => {
        it('elimina con éxito: llama a la API, cierra el modal, muestra toast de éxito y ejecuta onDelete', async () => {
            const user = userEvent.setup();
            mockDeleteReading.mockResolvedValueOnce({});

            render(<DeleteButton id={testId} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: /eliminar/i }));
            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            expect(mockDeleteReading).toHaveBeenCalledTimes(1);
            expect(mockDeleteReading).toHaveBeenCalledWith(testId);

            await waitFor(() => {
                expect(mockToastSuccess).toHaveBeenCalledWith('Lectura eliminada');
                expect(mockOnDelete).toHaveBeenCalledTimes(1);
                expect(screen.queryByText('¿Eliminar esta lectura?')).not.toBeInTheDocument();
            });
        });

        it('maneja el error si la API falla: muestra toast de error y no ejecuta onDelete', async () => {
            const user = userEvent.setup();
            vi.spyOn(console, 'error').mockImplementation(() => {});
            
            mockDeleteReading.mockRejectedValueOnce(new Error('Network Error'));

            render(<DeleteButton id={testId} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: /eliminar/i }));
            await user.click(screen.getByRole('button', { name: /confirmar/i }));

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith('No se pudo eliminar la lectura');
                expect(mockOnDelete).not.toHaveBeenCalled();
            });
        });
    });
});