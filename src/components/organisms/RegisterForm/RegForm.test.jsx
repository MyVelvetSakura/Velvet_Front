import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import RegForm from './RegForm';

const mockNavigate = vi.fn();
const mockToastError = vi.fn();
const mockAddAccount = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../hooks/useToast', () => ({
    default: () => ({ toast: { error: mockToastError, success: vi.fn() } }),
}));

vi.mock('../../../services/apiAccount', () => ({
    default: () => ({ addAccount: mockAddAccount }),
}));

const renderRegForm = () =>
    render(
        <MemoryRouter>
            <RegForm />
        </MemoryRouter>
    );

describe('RegForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza los campos de alias, email y contraseña', () => {
        renderRegForm();

        expect(screen.getByLabelText(/introduce un alias/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/introduce una contraseña/i)).toBeInTheDocument();
    });

    it('muestra un error si se envía el formulario vacío', async () => {
        const user = userEvent.setup();
        renderRegForm();

        await user.click(screen.getByText('Confirmar'));

        expect(mockToastError).toHaveBeenCalledWith('Se requieren todos los campos');
        expect(mockAddAccount).not.toHaveBeenCalled();
    });

    it('muestra un error de validación con un email inválido', async () => {
    const user = userEvent.setup();
    renderRegForm();

    await user.type(screen.getByLabelText(/introduce un alias/i), 'NuevaUsuaria');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'usuario@localhost');
    await user.type(screen.getByLabelText(/introduce una contraseña/i), 'password123');
    await user.click(screen.getByText('Confirmar'));

    expect(await screen.findByText(/email no válido/i)).toBeInTheDocument();
    expect(mockAddAccount).not.toHaveBeenCalled();
});

    it('muestra un error de validación con una contraseña corta', async () => {
    const user = userEvent.setup();
    renderRegForm();

    await user.type(screen.getByLabelText(/introduce un alias/i), 'NuevaUsuaria');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'nueva@gmail.com');
    await user.type(screen.getByLabelText(/introduce una contraseña/i), '1234');
    await user.click(screen.getByText('Confirmar'));

    expect(await screen.findByText(/al menos 8 carácteres/i)).toBeInTheDocument();
    expect(mockAddAccount).not.toHaveBeenCalled();
});

    it('registra la cuenta correctamente con datos válidos y navega a /info', async () => {
        const user = userEvent.setup();
        mockAddAccount.mockResolvedValueOnce({
            name: 'NuevaUsuaria',
            email: 'nueva@gmail.com',
        });

        renderRegForm();

        await user.type(screen.getByLabelText(/introduce un alias/i), 'NuevaUsuaria');
        await user.type(screen.getByLabelText(/correo electrónico/i), 'nueva@gmail.com');
        await user.type(screen.getByLabelText(/introduce una contraseña/i), 'password123');
        await user.click(screen.getByText('Confirmar'));

        expect(mockAddAccount).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'NuevaUsuaria',
                email: 'nueva@gmail.com',
                password: 'password123',
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/info', expect.anything());
    });

    it('muestra un toast de error si el nombre ya existe', async () => {
        const user = userEvent.setup();
        mockAddAccount.mockRejectedValueOnce({
            response: { data: 'El nombre ya está registrado' },
        });

        renderRegForm();

        await user.type(screen.getByLabelText(/introduce un alias/i), 'Ragnarok1');
        await user.type(screen.getByLabelText(/correo electrónico/i), 'otro@gmail.com');
        await user.type(screen.getByLabelText(/introduce una contraseña/i), 'password123');
        await user.click(screen.getByText('Confirmar'));

        expect(mockToastError).toHaveBeenCalledWith('El nombre ya está registrado');
    });
});