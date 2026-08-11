import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MusicPlayer from './MusicPlayer';
import useAudioPlayer from '../../../hooks/useAudioPlayer';

vi.mock('../../../hooks/useAudioPlayer');

describe('MusicPlayer Component', () => {
    const MODES = {
        OFF: 'OFF',
        LOOP_TRACK: 'LOOP_TRACK',
        PLAYLIST: 'PLAYLIST',
    };

    const mockSoundtrack = [
        { id: 'track-1', title: 'Canción 1' },
        { id: 'track-2', title: 'Canción 2' },
    ];

    const mockSetMode = vi.fn();
    const mockSetSelectedTrackId = vi.fn();
    const mockSetVolume = vi.fn();
    const mockTogglePlay = vi.fn();

    const defaultHookValues = {
        MODES,
        mode: MODES.PLAYLIST,
        setMode: mockSetMode,
        selectedTrackId: 'track-1',
        setSelectedTrackId: mockSetSelectedTrackId,
        volume: 0.5,
        setVolume: mockSetVolume,
        isPlaying: true,
        togglePlay: mockTogglePlay,
        soundtrack: mockSoundtrack,
        currentTrackTitle: 'Canción 1',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAudioPlayer).mockReturnValue(defaultHookValues);
    });

    describe('Botón flotante (Toggle principal)', () => {
        it('muestra 🔇 si el modo es OFF', () => {
            vi.mocked(useAudioPlayer).mockReturnValue({
                ...defaultHookValues,
                mode: MODES.OFF,
            });

            render(<MusicPlayer />);
            expect(screen.getByRole('button', { name: '🔇' })).toBeInTheDocument();
        });

        it('muestra 🎵 si está reproduciendo música (isPlaying = true)', () => {
            render(<MusicPlayer />);
            expect(screen.getByRole('button', { name: '🎵' })).toBeInTheDocument();
        });

        it('muestra ⏸️ si está pausado (isPlaying = false)', () => {
            vi.mocked(useAudioPlayer).mockReturnValue({
                ...defaultHookValues,
                isPlaying: false,
            });

            render(<MusicPlayer />);
            expect(screen.getByRole('button', { name: '⏸️' })).toBeInTheDocument();
        });

        it('abre y cierra el panel de controles al hacer clic', async () => {
            const user = userEvent.setup();
            render(<MusicPlayer />);

            const mainBtn = screen.getByRole('button', { name: '🎵' });

            expect(screen.queryByText('Banda sonora')).not.toBeInTheDocument();

            await user.click(mainBtn);
            expect(screen.getByText('Banda sonora')).toBeInTheDocument();

            await user.click(mainBtn);
            expect(screen.queryByText('Banda sonora')).not.toBeInTheDocument();
        });
    });

    describe('Panel de control y Cambios de modo', () => {
        it('cambia el modo al pulsar en "Silencio", "Repetir canción" o "Hilo musical"', async () => {
            const user = userEvent.setup();
            render(<MusicPlayer />);

            await user.click(screen.getByRole('button', { name: '🎵' }));

            await user.click(screen.getByRole('button', { name: 'Silencio' }));
            expect(mockSetMode).toHaveBeenCalledWith(MODES.OFF);

            await user.click(screen.getByRole('button', { name: 'Repetir canción' }));
            expect(mockSetMode).toHaveBeenCalledWith(MODES.LOOP_TRACK);

            await user.click(screen.getByRole('button', { name: 'Hilo musical' }));
            expect(mockSetMode).toHaveBeenCalledWith(MODES.PLAYLIST);
        });

        it('muestra el selector de canciones únicamente en modo LOOP_TRACK', async () => {
            const user = userEvent.setup();

            vi.mocked(useAudioPlayer).mockReturnValue({
                ...defaultHookValues,
                mode: MODES.LOOP_TRACK,
            });

            render(<MusicPlayer />);
            await user.click(screen.getByRole('button', { name: '🎵' }));

            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Canción 1' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Canción 2' })).toBeInTheDocument();

            await user.selectOptions(select, 'track-2');
            expect(mockSetSelectedTrackId).toHaveBeenCalledWith('track-2');
        });
    });

    describe('Controles de Reproducción y Volumen', () => {
        it('invoca togglePlay al pulsar el botón de Reproducir/Pausar', async () => {
            const user = userEvent.setup();
            render(<MusicPlayer />);

            await user.click(screen.getByRole('button', { name: '🎵' }));

            const playPauseBtn = screen.getByRole('button', { name: /pausar/i });
            await user.click(playPauseBtn);

            expect(mockTogglePlay).toHaveBeenCalledTimes(1);
        });

        it('oculta los controles de reproducción y volumen si el modo es OFF', async () => {
            const user = userEvent.setup();
            vi.mocked(useAudioPlayer).mockReturnValue({
                ...defaultHookValues,
                mode: MODES.OFF,
            });

            render(<MusicPlayer />);
            await user.click(screen.getByRole('button', { name: '🔇' }));

            expect(screen.queryByText(/Canción 1/i)).not.toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        it('actualiza el volumen al deslizar el control de rango', async () => {
            const user = userEvent.setup();
            render(<MusicPlayer />);

            await user.click(screen.getByRole('button', { name: '🎵' }));

            const volumeSlider = screen.getByRole('slider');
            expect(volumeSlider).toHaveValue('0.5');

            fireEvent.change(volumeSlider, { target: { value: '0.8' } });

            expect(mockSetVolume).toHaveBeenCalledWith(0.8);
        });
    });
});