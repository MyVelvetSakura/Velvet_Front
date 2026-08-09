import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToastContainer from './ToastContainer';

describe('ToastContainer', () => {
    it('no renderiza ningún toast cuando la lista está vacía', () => {
        const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />);

        expect(container.querySelectorAll('div').length).toBeLessThanOrEqual(1); // solo el wrapper
    });

    it('renderiza un toast por cada elemento de la lista', () => {
        const toasts = [
            { id: '1', message: 'Primero', type: 'success' },
            { id: '2', message: 'Segundo', type: 'error' },
        ];

        render(<ToastContainer toasts={toasts} onDismiss={vi.fn()} />);

        expect(screen.getByText('Primero')).toBeInTheDocument();
        expect(screen.getByText('Segundo')).toBeInTheDocument();
    });

    it('llama a onDismiss con el id correcto al hacer click en un toast', async () => {
        const { default: userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();
        const handleDismiss = vi.fn();

        const toasts = [{ id: 'abc-123', message: 'Mensaje único', type: 'info' }];

        render(<ToastContainer toasts={toasts} onDismiss={handleDismiss} />);

        await user.click(screen.getByText('Mensaje único'));

        expect(handleDismiss).toHaveBeenCalledWith('abc-123');
    });
});