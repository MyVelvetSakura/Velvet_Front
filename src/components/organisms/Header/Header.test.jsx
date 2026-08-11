import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useTheme from '../../../hooks/useTheme';
import { getAvatarSrc } from '../../../constants/avatars';

vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useTheme');

vi.mock('../../../constants/avatars', () => ({
    getAvatarSrc: vi.fn((key) => `/avatars/${key || 'default'}.png`),
}));

vi.mock('../../molecules/UserMenu/UserMenu', () => ({
    default: ({ user, avatarSrc, onLogout }) => (
        <div data-testid="mock-user-menu">
            <span>{user.name}</span>
            <img src={avatarSrc} alt="Avatar de usuario" />
            <button onClick={onLogout}>Desconectar</button>
        </div>
    ),
}));

describe('Header Component', () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();
    const mockSetTheme = vi.fn();

    const mockUserData = {
        name: 'Sakura',
        avatarKey: 'sakura-avatar',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(useTheme).mockReturnValue({ setTheme: mockSetTheme });
    });

    describe('Estado sin usuario autenticado (Guest)', () => {
        beforeEach(() => {
            vi.mocked(useAuth).mockReturnValue({
                user: null,
                logout: mockLogout,
            });
        });

        it('renderiza el título predeterminado y el subtítulo "Cartas del destino"', () => {
            render(<Header />);

            expect(screen.getByRole('heading', { level: 1, name: 'Velvet Sakura' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2, name: 'Cartas del destino' })).toBeInTheDocument();
        });

        it('no renderiza el menú de usuario (UserMenu)', () => {
            render(<Header />);

            expect(screen.queryByTestId('mock-user-menu')).not.toBeInTheDocument();
        });

        it('navega a "/home" al hacer clic en el logo cuando no hay usuario', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const logo = screen.getByTitle('Inicio');
            await user.click(logo);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    describe('Estado con usuario autenticado', () => {
        beforeEach(() => {
            vi.mocked(useAuth).mockReturnValue({
                user: mockUserData,
                logout: mockLogout,
            });
        });

        it('renderiza el mensaje de bienvenida con el nombre del usuario', () => {
            render(<Header />);

            expect(
                screen.getByRole('heading', { level: 2, name: 'Bienvenid@, Sakura' })
            ).toBeInTheDocument();
        });

        it('renderiza el componente UserMenu con los props correctos', () => {
            render(<Header />);

            expect(screen.getByTestId('mock-user-menu')).toBeInTheDocument();
            expect(getAvatarSrc).toHaveBeenCalledWith('sakura-avatar');
        });

        it('navega a "/readings" al hacer clic en el logo cuando hay usuario autenticado', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const logo = screen.getByTitle('Inicio');
            await user.click(logo);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/readings');
        });

        it('ejecuta logout, restablece el tema a "sakura" y navega a "/home" al cerrar sesión', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const logoutButton = screen.getByRole('button', { name: 'Desconectar' });
            await user.click(logoutButton);

            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(mockSetTheme).toHaveBeenCalledWith('sakura');
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });
});