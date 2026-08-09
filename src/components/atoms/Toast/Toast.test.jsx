import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from './Toast';

describe('Toast', () => {
    it('renderiza el mensaje recibido', () => {
        render(<Toast message="Operación exitosa" type="success" onDismiss={vi.fn()} />);

        expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    });

    it('aplica la clase correspondiente al tipo "success"', () => {
        const { container } = render(
            <Toast message="Éxito" type="success" onDismiss={vi.fn()} />
        );

        expect(container.firstChild.className).toContain('success');
    });

    it('aplica la clase correspondiente al tipo "error"', () => {
        const { container } = render(
            <Toast message="Error" type="error" onDismiss={vi.fn()} />
        );

        expect(container.firstChild.className).toContain('error');
    });

    it('llama a onDismiss al hacer click', async () => {
        const user = userEvent.setup();
        const handleDismiss = vi.fn();

        render(<Toast message="Mensaje" type="info" onDismiss={handleDismiss} />);

        await user.click(screen.getByText('Mensaje'));

        expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
});