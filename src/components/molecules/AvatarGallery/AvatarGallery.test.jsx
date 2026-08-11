import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AvatarGallery from './AvatarGallery';
import { AVATARS, AVATAR_OPTIONS } from '../../../constants/avatars';

describe('AvatarGallery', () => {
    it('renderiza todas las opciones de avatar definidas en las constantes', () => {
        render(<AvatarGallery selected="" onSelect={vi.fn()} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(AVATAR_OPTIONS.length);
    });

    it('asigna correctamente las propiedades src y alt a cada imagen', () => {
        render(<AvatarGallery selected="" onSelect={vi.fn()} />);

        AVATAR_OPTIONS.forEach((key) => {
            const img = screen.getByRole('img', { name: key });
            expect(img).toHaveAttribute('src', AVATARS[key]);
        });
    });

    it('aplica la clase de selección únicamente al avatar seleccionado', () => {
        const selectedKey = AVATAR_OPTIONS[0];
        render(<AvatarGallery selected={selectedKey} onSelect={vi.fn()} />);

        const buttons = screen.getAllByRole('button');
        const selectedButton = screen.getByRole('img', { name: selectedKey }).closest('button');

        expect(selectedButton.className).toMatch(/selected/);

        buttons
            .filter((btn) => btn !== selectedButton)
            .forEach((btn) => {
                expect(btn.className).not.toMatch(/selected/);
            });
    });

    it('llama a onSelect pasando el key correcto al hacer clic en un avatar', async () => {
        const user = userEvent.setup();
        const handleSelect = vi.fn();
        const targetKey = AVATAR_OPTIONS[1] || AVATAR_OPTIONS[0];

        render(<AvatarGallery selected="" onSelect={handleSelect} />);

        const buttonToClick = screen.getByRole('img', { name: targetKey }).closest('button');
        await user.click(buttonToClick);

        expect(handleSelect).toHaveBeenCalledTimes(1);
        expect(handleSelect).toHaveBeenCalledWith(targetKey);
    });
});