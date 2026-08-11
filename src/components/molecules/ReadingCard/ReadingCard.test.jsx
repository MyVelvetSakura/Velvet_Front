import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReadingCard from './ReadingCard';
import { useNavigate } from 'react-router';
import apiReading from '../../../services/apiReading.jsx';

vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../../services/apiReading.jsx');

vi.mock('../../atoms/EditButton/EditButton.jsx', () => ({
    default: ({ onOpenEdit }) => (
        <button onClick={onOpenEdit}>Editar</button>
    ),
}));

vi.mock('../../atoms/CheckButton/CheckButton.jsx', () => ({
    default: ({ onSave }) => (
        <button onClick={onSave}>Guardar</button>
    ),
}));

vi.mock('../DeleteButton/DeleteButton.jsx', () => ({
    default: ({ id, onDelete }) => (
        <button onClick={() => onDelete(id)}>Eliminar-{id}</button>
    ),
}));

describe('ReadingCard Component', () => {
    const mockNavigate = vi.fn();
    const mockEditName = vi.fn();
    const mockOnDelete = vi.fn();

    const mockData = {
        id: 'read-101',
        name: 'Tirada del Juicio',
        date: '11/08/2026',
        pastCardId: 'card-past',
        presentCardId: 'card-present',
        futureCardId: 'card-future',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        vi.mocked(apiReading).mockReturnValue({
            editName: mockEditName,
        });
    });

    describe('Renderizado inicial', () => {
        it('muestra la fecha, el nombre actual y los botones iniciales', () => {
            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            expect(screen.getByText('11/08/2026')).toBeInTheDocument();
            expect(screen.getByText('Tirada del Juicio')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: `Eliminar-${mockData.id}` })).toBeInTheDocument();
            
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });

        it('muestra la imagen del historial con su alt adecuado', () => {
            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            const img = screen.getByAltText('icono Historial');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'src/assets/images/historial.png');
        });
    });

    describe('Navegación al perfil', () => {
        it('navega a /profile con los datos de las cartas en el state al hacer clic en el icono', async () => {
            const user = userEvent.setup();
            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            const iconWrapper = screen.getByTitle('Cartas guardadas');
            await user.click(iconWrapper);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/profile', {
                state: {
                    past: mockData.pastCardId,
                    present: mockData.presentCardId,
                    future: mockData.futureCardId,
                    name: mockData.name,
                    id: mockData.id,
                },
            });
        });
    });

    describe('Flujo de edición de nombre', () => {
        it('activa el modo edición al hacer clic en Editar y muestra el input con el nombre actual', async () => {
            const user = userEvent.setup();
            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: 'Editar' }));

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('Tirada del Juicio');
            expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
        });

        it('guarda el nuevo nombre exitosamente llamando a la API y sale del modo edición', async () => {
            const user = userEvent.setup();
            mockEditName.mockResolvedValueOnce({});

            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: 'Editar' }));

            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, 'Nuevo Nombre Tirada');

            await user.click(screen.getByRole('button', { name: 'Guardar' }));

            expect(mockEditName).toHaveBeenCalledWith('read-101', 'Nuevo Nombre Tirada');

            await waitFor(() => {
                expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
                expect(screen.getByText('Nuevo Nombre Tirada')).toBeInTheDocument();
            });
        });

        it('muestra una alerta y registra un error si la API falla al guardar', async () => {
            const user = userEvent.setup();
            const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            mockEditName.mockRejectedValueOnce(new Error('API Error'));

            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            await user.click(screen.getByRole('button', { name: 'Editar' }));
            await user.click(screen.getByRole('button', { name: 'Guardar' }));

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error al actualizar:', expect.any(Error));
                expect(alertSpy).toHaveBeenCalledWith('No se pudo guardar el cambio.');
                expect(screen.getByRole('textbox')).toBeInTheDocument();
            });
        });
    });

    describe('Eliminación', () => {
        it('delega la acción de borrado al componente DeleteButton pasándole el id y callback correctamente', async () => {
            const user = userEvent.setup();
            render(<ReadingCard data={mockData} onDelete={mockOnDelete} />);

            const deleteBtn = screen.getByRole('button', { name: `Eliminar-${mockData.id}` });
            await user.click(deleteBtn);

            expect(mockOnDelete).toHaveBeenCalledWith('read-101');
        });
    });
});