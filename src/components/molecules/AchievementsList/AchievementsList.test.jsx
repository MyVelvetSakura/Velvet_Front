import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AchievementsList from './AchievementsList';

describe('AchievementsList', () => {
    const mockAchievements = [
        {
            code: 'first_win',
            title: 'Primera Victoria',
            description: 'Gana tu primera partida',
            unlocked: true,
            creditsReward: 50,
        },
        {
            code: 'master_level',
            title: 'Maestro',
            description: 'Alcanza el nivel 100',
            unlocked: false,
            creditsReward: 200,
        },
    ];

    it('renderiza la lista de logros correctamente', () => {
        render(<AchievementsList achievements={mockAchievements} />);

        expect(screen.getByText('Primera Victoria')).toBeInTheDocument();
        expect(screen.getByText('Maestro')).toBeInTheDocument();
    });

    it('muestra los detalles de un logro desbloqueado (ícono, texto y recompensa)', () => {
        render(<AchievementsList achievements={mockAchievements} />);

        expect(screen.getByRole('heading', { name: 'Primera Victoria', level: 4 })).toBeInTheDocument();
        expect(screen.getByText('Gana tu primera partida')).toBeInTheDocument();

        expect(screen.getByText('🏆')).toBeInTheDocument();

        expect(screen.getByText('+50 🪶')).toBeInTheDocument();
    });

    it('muestra los detalles de un logro bloqueado (ícono de candado y oculta la recompensa)', () => {
        render(<AchievementsList achievements={mockAchievements} />);

        expect(screen.getByRole('heading', { name: 'Maestro', level: 4 })).toBeInTheDocument();
        expect(screen.getByText('Alcanza el nivel 100')).toBeInTheDocument();

        expect(screen.getByText('🔒')).toBeInTheDocument();

        expect(screen.queryByText('+200 🪶')).not.toBeInTheDocument();
    });

    it('aplica las clases CSS correspondientes según si está desbloqueado o no', () => {
        render(<AchievementsList achievements={mockAchievements} />);

        const unlockedCard = screen.getByText('Primera Victoria').closest('div');
        const lockedCard = screen.getByText('Maestro').closest('div');

        expect(unlockedCard.className).toMatch(/unlocked/);
        expect(lockedCard.className).toMatch(/locked/);
    });

    it('renderiza un contenedor vacío si no hay logros', () => {
        const { container } = render(<AchievementsList achievements={[]} />);
        expect(container.firstChild.children).toHaveLength(0);
    });
});