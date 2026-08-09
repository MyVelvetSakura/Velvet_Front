import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ForgotPassword from './ForgotPassword';

const mockNavigate = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();
const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useToast', () => ({
    default: () => ({ toast: { error: mockToastError, success: mockToastSuccess } }),
}));

vi.mock('../../services/apiAccount', () => ({
    default: () => ({
        forgotPassword: mockForgotPassword,
        resetPassword: mockResetPassword,
    }),
}));

const renderForgotPassword = () =>
    render(
        <MemoryRouter>
            <ForgotPassword />
        </MemoryRouter>
    );

describe('ForgotPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el paso de email por defecto', () => {
        renderForgotPassword();

        expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
        expect(screen.getByText('Enviar código')).toBeInTheDocument();
    });

    it('muestra un error si se intenta pedir el código sin email', async () => {
        const user = userEvent.setup();
        renderForgotPassword();

        await user.click(screen.getByText('Enviar código'));

        expect(mockToastError).toHaveBeenCalledWith('Introduce tu email');
        expect(mockForgotPassword).not.toHaveBeenCalled();
    });

    it('avanza al paso del código tras solicitar el reseteo correctamente', async () => {
        const user = userEvent.setup();
        mockForgotPassword.mockResolvedValueOnce({});

        renderForgotPassword();

        await user.type(screen.getByLabelText(/email:/i), 'ragnarok1@gmail.com');
        await user.click(screen.getByText('Enviar código'));

        expect(mockForgotPassword).toHaveBeenCalledWith('ragnarok1@gmail.com');
        expect(mockToastSuccess).toHaveBeenCalled();
        expect(screen.getByLabelText(/código:/i)).toBeInTheDocument();
    });

    it('muestra error si las contraseñas no coinciden en el paso del código', async () => {
        const user = userEvent.setup();
        mockForgotPassword.mockResolvedValueOnce({});

        renderForgotPassword();

        await user.type(screen.getByLabelText(/email:/i), 'ragnarok1@gmail.com');
        await user.click(screen.getByText('Enviar código'));

        await user.type(screen.getByLabelText(/código:/i), '483920');
        await user.type(screen.getByLabelText(/nueva contraseña:/i), 'password123');
        await user.type(screen.getByLabelText(/confirma la contraseña:/i), 'passwordDistinta');
        await user.click(screen.getByText('Actualizar contraseña'));

        expect(mockToastError).toHaveBeenCalledWith('Las contraseñas no coinciden');
        expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it('resetea la contraseña correctamente y navega a /home', async () => {
        const user = userEvent.setup();
        mockForgotPassword.mockResolvedValueOnce({});
        mockResetPassword.mockResolvedValueOnce({});

        renderForgotPassword();

        await user.type(screen.getByLabelText(/email:/i), 'ragnarok1@gmail.com');
        await user.click(screen.getByText('Enviar código'));

        await user.type(screen.getByLabelText(/código:/i), '483920');
        await user.type(screen.getByLabelText(/nueva contraseña:/i), 'password123');
        await user.type(screen.getByLabelText(/confirma la contraseña:/i), 'password123');
        await user.click(screen.getByText('Actualizar contraseña'));

        expect(mockResetPassword).toHaveBeenCalledWith('ragnarok1@gmail.com', '483920', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('muestra un toast de error si el código es incorrecto', async () => {
        const user = userEvent.setup();
        mockForgotPassword.mockResolvedValueOnce({});
        mockResetPassword.mockRejectedValueOnce({
            response: { data: 'Código incorrecto' },
        });

        renderForgotPassword();

        await user.type(screen.getByLabelText(/email:/i), 'ragnarok1@gmail.com');
        await user.click(screen.getByText('Enviar código'));

        await user.type(screen.getByLabelText(/código:/i), '000000');
        await user.type(screen.getByLabelText(/nueva contraseña:/i), 'password123');
        await user.type(screen.getByLabelText(/confirma la contraseña:/i), 'password123');
        await user.click(screen.getByText('Actualizar contraseña'));

        expect(mockToastError).toHaveBeenCalledWith('Código incorrecto');
    });
});