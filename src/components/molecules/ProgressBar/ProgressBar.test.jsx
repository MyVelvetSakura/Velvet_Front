import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
    const defaultProps = {
        level: 5,
        experience: 50,
        experienceToNextLevel: 50,
        credits: 120,
    };

    it('renderiza la información básica del usuario (nivel y créditos)', () => {
        render(<ProgressBar {...defaultProps} />);

        expect(screen.getByText('Nivel 5')).toBeInTheDocument();

        expect(screen.getByText('🪶 120 Plumas de Yue')).toBeInTheDocument();
    });

    it('calcula y muestra correctamente el total de experiencia requerida', () => {
        render(<ProgressBar {...defaultProps} />);

        expect(screen.getByText('50 / 100 XP')).toBeInTheDocument();
    });

    describe('Cálculo del porcentaje y ancho de la barra de progreso', () => {
        it('calcula el 50% de ancho cuando la experiencia actual es la mitad del total', () => {
            const { container } = render(
                <ProgressBar
                    level={1}
                    experience={50}
                    experienceToNextLevel={50}
                    credits={10}
                />
            );

            const fillBar = container.querySelector('div[style]');
            expect(fillBar).toHaveStyle({ width: '50%' });
        });

        it('calcula el 100% de ancho cuando no falta experiencia para el siguiente nivel', () => {
            const { container } = render(
                <ProgressBar
                    level={2}
                    experience={200}
                    experienceToNextLevel={0}
                    credits={50}
                />
            );

            expect(screen.getByText('200 / 200 XP')).toBeInTheDocument();

            const fillBar = container.querySelector('div[style]');
            expect(fillBar).toHaveStyle({ width: '100%' });
        });

        it('gestiona de forma segura la división por cero cuando la experiencia total es 0', () => {
            const { container } = render(
                <ProgressBar
                    level={1}
                    experience={0}
                    experienceToNextLevel={0}
                    credits={0}
                />
            );

            expect(screen.getByText('0 / 0 XP')).toBeInTheDocument();

            const fillBar = container.querySelector('div[style]');
            expect(fillBar).toHaveStyle({ width: '0%' });
        });

        it('calcula correctamente porcentajes decimales/no exactos', () => {
            const { container } = render(
                <ProgressBar
                    level={3}
                    experience={25}
                    experienceToNextLevel={75}
                    credits={30}
                />
            );

            const fillBar = container.querySelector('div[style]');
            expect(fillBar).toHaveStyle({ width: '25%' });
        });
    });
});