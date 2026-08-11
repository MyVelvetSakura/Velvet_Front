import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditButton from './EditButton';

describe('EditButton', () => {
    it('renderiza un botón accesible', () => {
        render(<EditButton onOpenEdit={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Editar nombre' })).toBeInTheDocument();
    });

    it('llama a onOpenEdit al hacer click', async () => {
        const user = userEvent.setup();
        const handleOpenEdit = vi.fn();

        render(<EditButton onOpenEdit={handleOpenEdit} />);

        await user.click(screen.getByRole('button', { name: 'Editar nombre' }));

        expect(handleOpenEdit).toHaveBeenCalledTimes(1);
    });
});