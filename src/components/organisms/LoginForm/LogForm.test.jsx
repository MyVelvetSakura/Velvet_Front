import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import LogForm from './LogForm';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockToastError = vi.fn();
const mockLoginApi = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../hooks/useAuth', () => ({
    default: () => ({ login: mockLogin }),
}));

vi.mock('../../../hooks/useToast', () => ({
    default: () => ({ toast: { error: mockToastError, success: vi.fn() } }),
}));

vi.mock('../../../services/apiAccount', () => ({
    default: () => ({ login: mockLoginApi }),
}));

const renderLogForm = () =>
    render(
        <MemoryRouter>
            <LogForm />
        </MemoryRouter>
    );

describe('LogForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza los campos de alias y contraseña', () => {
        renderLogForm();

        expect(screen.getByLabelText(/introduce un alias/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/introduce una contraseña/i)).toBeInTheDocument();
    });

    it('muestra un error si se envía el formulario sin rellenar', async () => {
        const user = userEvent.setup();
        renderLogForm();

        await user.click(screen.getByText('Confirmar'));

        expect(mockToastError).toHaveBeenCalledWith('Completa todos los campos');
        expect(mockLoginApi).not.toHaveBeenCalled();
    });

    it('inicia sesión correctamente con credenciales válidas', async () => {
        const user = userEvent.setup();
        mockLoginApi.mockResolvedValueOnce({
            account: { id: 1, name: 'Ragnarok1', email: 'ragnarok1@gmail.com', avatarKey: 'default' },
            token: 'fake-jwt-token',
        });

        renderLogForm();

        await user.type(screen.getByLabelText(/introduce un alias/i), 'Ragnarok1');
        await user.type(screen.getByLabelText(/introduce una contraseña/i), 'password123');
        await user.click(screen.getByText('Confirmar'));

        expect(mockLoginApi).toHaveBeenCalledWith('Ragnarok1', 'password123');
        expect(mockLogin).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Ragnarok1' }),
            'fake-jwt-token'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/readings');
    });

   it('muestra un toast de error si el backend rechaza el login', async () => {
    const user = userEvent.setup();
    mockLoginApi.mockRejectedValueOnce({
        response: { data: 'Contraseña incorrecta' },
    });

    renderLogForm();

    await user.type(screen.getByLabelText(/introduce un alias/i), 'Ragnarok1');
    await user.type(screen.getByLabelText(/introduce una contraseña/i), 'malaContraseña');
    await user.click(screen.getByText('Confirmar'));

    expect(mockToastError).toHaveBeenCalledWith('Contraseña incorrecta');
    expect(mockNavigate).not.toHaveBeenCalledWith('/readings');
});

    it('extrae el mensaje del campo error cuando la respuesta es un objeto', async () => {
        const user = userEvent.setup();
        mockLoginApi.mockRejectedValueOnce({
            response: { data: { error: 'Not Found' } },
        });

        renderLogForm();

        await user.type(screen.getByLabelText(/introduce un alias/i), 'NoExiste');
        await user.type(screen.getByLabelText(/introduce una contraseña/i), 'password123');
        await user.click(screen.getByText('Confirmar'));

        expect(mockToastError).toHaveBeenCalledWith('Not Found');
    });
});