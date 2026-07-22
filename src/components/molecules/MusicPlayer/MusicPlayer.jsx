import { useState } from "react";
import useAudioPlayer from "../../../hooks/useAudioPlayer";
import styles from "./music-player.module.css";

const MusicPlayer = () => {
    const {
        MODES, mode, setMode,
        selectedTrackId, setSelectedTrackId,
        volume, setVolume,
        isPlaying, togglePlay,
        soundtrack, currentTrackTitle,
    } = useAudioPlayer();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <button className={styles.toggleBtn} onClick={() => setIsOpen((v) => !v)} title="Música">
                {mode === MODES.OFF ? "🔇" : isPlaying ? "🎵" : "⏸️"}
            </button>

            {isOpen && (
                <div className={styles.panel}>
                    <h4 className={styles.title}>Banda sonora</h4>

                    <div className={styles.modeRow}>
                        <button
                            className={`${styles.modeBtn} ${mode === MODES.OFF ? styles.active : ""}`}
                            onClick={() => setMode(MODES.OFF)}
                        >
                            Silencio
                        </button>
                        <button
                            className={`${styles.modeBtn} ${mode === MODES.LOOP_TRACK ? styles.active : ""}`}
                            onClick={() => setMode(MODES.LOOP_TRACK)}
                        >
                            Repetir canción
                        </button>
                        <button
                            className={`${styles.modeBtn} ${mode === MODES.PLAYLIST ? styles.active : ""}`}
                            onClick={() => setMode(MODES.PLAYLIST)}
                        >
                            Hilo musical
                        </button>
                    </div>

                    {mode === MODES.LOOP_TRACK && (
                        <select
                            className={styles.select}
                            value={selectedTrackId}
                            onChange={(e) => setSelectedTrackId(e.target.value)}
                        >
                            {soundtrack.map((t) => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    )}

                    {mode !== MODES.OFF && (
                        <>
                            <p className={styles.nowPlaying}>🎶 {currentTrackTitle}</p>

                            <div className={styles.controlsRow}>
                                <button className={styles.playBtn} onClick={togglePlay}>
                                    {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
                                </button>
                            </div>

                            <div className={styles.volumeRow}>
                                <span>🔊</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className={styles.volumeSlider}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;