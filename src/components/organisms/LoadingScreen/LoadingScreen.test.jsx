import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen Component', () => {
    it('renderiza los textos fijos correctamente', () => {
        render(<LoadingScreen progress={50} />);

        expect(
            screen.getByRole('heading', { level: 2, name: 'Capturando cartas...' })
        ).toBeInTheDocument();

        expect(
            screen.getByText('La magia nos acompaña')
        ).toBeInTheDocument();
    });

    it('muestra el valor de progreso numérico y actualiza el ancho de la barra', () => {
        const testProgress = 75;
        const { container } = render(<LoadingScreen progress={testProgress} />);

        expect(screen.getByText(`${testProgress}%`)).toBeInTheDocument();

        const progressBar = container.querySelector('.progress');
        expect(progressBar).toBeInTheDocument();
        expect(progressBar).toHaveStyle({ width: '75%' });
    });

    it('se comporta correctamente con progreso en 0%', () => {
        const { container } = render(<LoadingScreen progress={0} />);

        expect(screen.getByText('0%')).toBeInTheDocument();

        const progressBar = container.querySelector('.progress');
        expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('se comporta correctamente con progreso al 100%', () => {
        const { container } = render(<LoadingScreen progress={100} />);

        expect(screen.getByText('100%')).toBeInTheDocument();

        const progressBar = container.querySelector('.progress');
        expect(progressBar).toHaveStyle({ width: '100%' });
    });
});