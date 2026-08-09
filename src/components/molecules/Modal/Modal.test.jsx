import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
    it('renderiza el título, el contenido y las acciones', () => {
        render(
            <Modal title="Confirmar acción" onClose={vi.fn()} actions={<button>Aceptar</button>}>
                <p>Contenido del modal</p>
            </Modal>
        );

        expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
        expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
        expect(screen.getByText('Aceptar')).toBeInTheDocument();
    });

    it('no renderiza el título si no se proporciona', () => {
        render(
            <Modal onClose={vi.fn()}>
                <p>Solo contenido</p>
            </Modal>
        );

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('llama a onClose al hacer click en el overlay', async () => {
        const user = userEvent.setup();
        const handleClose = vi.fn();

        const { container } = render(
            <Modal title="Título" onClose={handleClose}>
                <p>Contenido</p>
            </Modal>
        );

        const overlay = container.firstChild;
        await user.click(overlay);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('NO llama a onClose al hacer click dentro del contenido del modal', async () => {
        const user = userEvent.setup();
        const handleClose = vi.fn();

        render(
            <Modal title="Título" onClose={handleClose}>
                <p>Contenido interno</p>
            </Modal>
        );

        await user.click(screen.getByText('Contenido interno'));

        expect(handleClose).not.toHaveBeenCalled();
    });

    it('llama a onClose al pulsar la tecla Escape', () => {
        const handleClose = vi.fn();

        render(
            <Modal title="Título" onClose={handleClose}>
                <p>Contenido</p>
            </Modal>
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('renderiza el fondo decorativo (background) cuando se proporciona', () => {
        render(
            <Modal
                title="Título"
                onClose={vi.fn()}
                background={<div data-testid="fondo-decorativo" />}
            >
                <p>Contenido</p>
            </Modal>
        );

        expect(screen.getByTestId('fondo-decorativo')).toBeInTheDocument();
    });
});