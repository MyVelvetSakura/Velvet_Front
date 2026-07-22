import { useState, useRef, useEffect, useCallback } from "react";
import { AudioContext } from "./AudioContext";
import { SOUNDTRACK } from "../../constants/soundtrack";

const MODES = {
  OFF: "off",
  LOOP_TRACK: "loop-track",
  PLAYLIST: "playlist",
};

export const AudioProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("audioMode") || MODES.OFF);
  const [selectedTrackId, setSelectedTrackId] = useState(
    () => localStorage.getItem("audioTrackId") || SOUNDTRACK[0]?.id
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("audioVolume");
    return stored ? parseFloat(stored) : 0.5;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    localStorage.setItem("audioMode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("audioTrackId", selectedTrackId);
  }, [selectedTrackId]);

  useEffect(() => {
    localStorage.setItem("audioVolume", volume.toString());
    audioRef.current.volume = volume;
  }, [volume]);

  const getTrackSrc = useCallback(() => {
    if (mode === MODES.LOOP_TRACK) {
      return SOUNDTRACK.find((t) => t.id === selectedTrackId)?.src;
    }
    if (mode === MODES.PLAYLIST) {
      return SOUNDTRACK[currentTrackIndex]?.src;
    }
    return null;
  }, [mode, selectedTrackId, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (mode === MODES.LOOP_TRACK) {
        audio.currentTime = 0;
        audio.play();
      } else if (mode === MODES.PLAYLIST) {
        setCurrentTrackIndex((prev) => (prev + 1) % SOUNDTRACK.length);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [mode]);

  useEffect(() => {
    const audio = audioRef.current;
    const src = getTrackSrc();

    if (mode === MODES.OFF || !src) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (audio.src !== new URL(src, window.location.href).href) {
      audio.src = src;
    }
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [mode, selectedTrackId, currentTrackIndex]);

  const play = () => {
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (mode === MODES.OFF) return;
    isPlaying ? pause() : play();
  };

  const setModeAndReset = (newMode) => {
    setMode(newMode);
    setCurrentTrackIndex(0);
  };

  return (
    <AudioContext.Provider
      value={{
        MODES,
        mode,
        setMode: setModeAndReset,
        selectedTrackId,
        setSelectedTrackId,
        currentTrackIndex,
        volume,
        setVolume,
        isPlaying,
        togglePlay,
        soundtrack: SOUNDTRACK,
        currentTrackTitle:
          mode === MODES.PLAYLIST
            ? SOUNDTRACK[currentTrackIndex]?.title
            : SOUNDTRACK.find((t) => t.id === selectedTrackId)?.title,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};