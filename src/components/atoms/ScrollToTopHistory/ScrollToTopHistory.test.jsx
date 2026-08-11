import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollToTopHistory from './ScrollToTopHistory';

describe('ScrollToTopHistory', () => {
    beforeEach(() => {
        window.scrollY = 0;
        window.scrollTo = vi.fn();
    });

    it('no renderiza el botón cuando el scroll está en la parte superior', () => {
        render(<ScrollToTopHistory />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renderiza el botón tras hacer scroll por debajo del umbral', () => {
        render(<ScrollToTopHistory />);

        window.scrollY = 400;
        fireEvent.scroll(window);

        expect(screen.getByRole('button', { name: /volver arriba/i })).toBeInTheDocument();
    });

    it('oculta el botón de nuevo si se vuelve a subir por encima del umbral', () => {
        render(<ScrollToTopHistory />);

        window.scrollY = 400;
        fireEvent.scroll(window);
        expect(screen.getByRole('button', { name: /volver arriba/i })).toBeInTheDocument();

        window.scrollY = 100;
        fireEvent.scroll(window);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('llama a window.scrollTo con top: 0 y comportamiento suave al hacer click', async () => {
        const user = userEvent.setup();
        render(<ScrollToTopHistory />);

        window.scrollY = 400;
        fireEvent.scroll(window);

        await user.click(screen.getByRole('button', { name: /volver arriba/i }));

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});