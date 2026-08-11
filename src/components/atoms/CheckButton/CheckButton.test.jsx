import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckButton from './CheckButton';

describe('CheckButton', () => {
    it('renderiza un botón accesible', () => {
        render(<CheckButton onSave={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Guardar cambio' })).toBeInTheDocument();
    });

    it('llama a onSave al hacer click', async () => {
        const user = userEvent.setup();
        const handleSave = vi.fn();

        render(<CheckButton onSave={handleSave} />);

        await user.click(screen.getByRole('button', { name: 'Guardar cambio' }));

        expect(handleSave).toHaveBeenCalledTimes(1);
    });
});