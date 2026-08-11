import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ThemeDecoration from './ThemeDecoration';

const mockUseTheme = vi.fn();

vi.mock('../../../hooks/useTheme', () => ({
    default: () => mockUseTheme(),
}));

describe('ThemeDecoration', () => {
    it('renderiza pétalos cuando el tema es "sakura"', () => {
        mockUseTheme.mockReturnValue({ theme: 'sakura' });

        const { container } = render(<ThemeDecoration />);

        // Los pétalos son <span> generados dinámicamente dentro de la capa sakura
        const petals = container.querySelectorAll('span');
        expect(petals.length).toBeGreaterThan(0);
    });

    it('renderiza el círculo astral y estrellas cuando el tema es "clow"', () => {
        mockUseTheme.mockReturnValue({ theme: 'clow' });

        const { container } = render(<ThemeDecoration />);

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('no renderiza el círculo astral cuando el tema es "sakura"', () => {
        mockUseTheme.mockReturnValue({ theme: 'sakura' });

        const { container } = render(<ThemeDecoration />);

        expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
});