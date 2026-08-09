import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Button from './Button';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Button', () => {
    it('renderiza el texto recibido por prop', () => {
        render(
            <MemoryRouter>
                <Button text="Confirmar" BtnClass="subm_btn" path="/home" />
            </MemoryRouter>
        );

        expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });

    it('aplica la clase CSS recibida por prop', () => {
        render(
            <MemoryRouter>
                <Button text="Confirmar" BtnClass="mi-clase-custom" path="/home" />
            </MemoryRouter>
        );

        expect(screen.getByRole('button')).toHaveClass('mi-clase-custom');
    });

    it('navega a la ruta indicada al hacer click', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Button text="Ir al inicio" BtnClass="subm_btn" path="/home" />
            </MemoryRouter>
        );

        await user.click(screen.getByText('Ir al inicio'));

        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('navega a la ruta correcta cuando cambia la prop path', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Button text="Regístrate" BtnClass="subm_btn" path="/register" />
            </MemoryRouter>
        );

        await user.click(screen.getByText('Regístrate'));

        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});