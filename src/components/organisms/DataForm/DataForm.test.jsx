import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import DataForm from './DataForm';

describe('DataForm Component', () => {
    it('renderiza el mensaje de bienvenida y el avatar con el nombre recibido desde location.state', () => {
        const mockState = {
            name: 'Sakura Kinomoto',
            email: 'sakura@clow.com',
            password: 'secretpassword',
        };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/data-form', state: mockState }]}>
                <DataForm />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { level: 3, name: /¡bienvenid@ sakura kinomoto a velvet sakura!/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/recibirás un correo con los datos de cuenta/i)
        ).toBeInTheDocument();

        const avatarImg = screen.getByRole('img');
        expect(avatarImg).toHaveAttribute('alt', 'Sakura Kinomoto');
        expect(avatarImg).toHaveAttribute('title', 'Sakura Kinomoto');
    });

    it('soporta la renderización sin errores cuando location.state es undefined (acceso directo)', () => {
        render(
            <MemoryRouter initialEntries={['/data-form']}>
                <DataForm />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            '¡Bienvenid@ a Velvet Sakura!'
        );

        expect(screen.getByRole('button', { name: /inicio/i })).toBeInTheDocument();
    });

    it('renderiza el botón de navegación hacia el Inicio ("/")', () => {
        render(
            <MemoryRouter initialEntries={['/data-form']}>
                <DataForm />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /inicio/i });
        expect(button).toBeInTheDocument();
    });
});