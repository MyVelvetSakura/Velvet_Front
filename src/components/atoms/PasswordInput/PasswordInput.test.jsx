import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from './PasswordInput';

describe('PasswordInput', () => {
    it('renderiza el input como type="password" por defecto', () => {
        render(<PasswordInput id="password" value="" onChange={vi.fn()} placeholder="Contraseña" />);

        const input = screen.getByPlaceholderText('Contraseña');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('usa el id como name si no se pasa la prop name explícitamente', () => {
        render(<PasswordInput id="deletePassword" value="" onChange={vi.fn()} placeholder="Contraseña" />);

        const input = screen.getByPlaceholderText('Contraseña');
        expect(input).toHaveAttribute('name', 'deletePassword');
        expect(input).toHaveAttribute('id', 'deletePassword');
    });

    it('respeta la prop name si se pasa explícitamente, distinta del id', () => {
        render(
            <PasswordInput id="password" name="customName" value="" onChange={vi.fn()} placeholder="Contraseña" />
        );

        const input = screen.getByPlaceholderText('Contraseña');
        expect(input).toHaveAttribute('name', 'customName');
    });

    it('muestra el texto en claro al pulsar el botón de mostrar contraseña', async () => {
        const user = userEvent.setup();
        render(<PasswordInput id="password" value="miContraseña" onChange={vi.fn()} placeholder="Contraseña" />);

        const input = screen.getByPlaceholderText('Contraseña');
        expect(input).toHaveAttribute('type', 'password');

        await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }));

        expect(input).toHaveAttribute('type', 'text');
    });

    it('vuelve a ocultar la contraseña al pulsar el botón de nuevo', async () => {
        const user = userEvent.setup();
        render(<PasswordInput id="password" value="miContraseña" onChange={vi.fn()} placeholder="Contraseña" />);

        const toggleBtn = screen.getByRole('button', { name: /mostrar contraseña/i });
        await user.click(toggleBtn);
        await user.click(screen.getByRole('button', { name: /ocultar contraseña/i }));

        expect(screen.getByPlaceholderText('Contraseña')).toHaveAttribute('type', 'password');
    });

    it('llama a onChange al escribir, pasando el evento con el value correcto', async () => {
    const user = userEvent.setup();
    let capturedValue = '';
    const handleChange = vi.fn((e) => {
        capturedValue = e.target.value;
    });

    render(<PasswordInput id="password" value="" onChange={handleChange} placeholder="Contraseña" />);

    await user.type(screen.getByPlaceholderText('Contraseña'), 'a');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(capturedValue).toBe('a');
});

    it('el botón de mostrar/ocultar no participa en el orden de tabulación (tabIndex -1)', () => {
        render(<PasswordInput id="password" value="" onChange={vi.fn()} placeholder="Contraseña" />);

        const toggleBtn = screen.getByRole('button');
        expect(toggleBtn).toHaveAttribute('tabindex', '-1');
    });
});