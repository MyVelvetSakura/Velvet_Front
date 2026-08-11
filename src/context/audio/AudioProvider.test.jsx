import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";
import { AudioProvider } from "./AudioProvider";
import { AudioContext } from "./AudioContext";

vi.mock("../../constants/soundtrack", () => ({
  SOUNDTRACK: [
    { id: "track-1", title: "Pista 1", src: "/track1.mp3" },
    { id: "track-2", title: "Pista 2", src: "/track2.mp3" },
  ],
}));

describe("AudioProvider Component", () => {
  let mockAudioInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockAudioInstance = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      volume: 0.5,
      src: "",
      currentTime: 0,
    };

    vi.stubGlobal(
      "Audio",
      vi.fn().mockImplementation(function () {
        return mockAudioInstance;
      })
    );
  });

  const useCustomHook = () => useContext(AudioContext);

  it("inicializa el contexto con los valores por defecto", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    expect(result.current.mode).toBe("off");
    expect(result.current.selectedTrackId).toBe("track-1");
    expect(result.current.volume).toBe(0.5);
    expect(result.current.isPlaying).toBe(false);
  });

  it("lee los valores iniciales desde localStorage si existen", () => {
    localStorage.setItem("audioMode", "loop-track");
    localStorage.setItem("audioTrackId", "track-2");
    localStorage.setItem("audioVolume", "0.8");

    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    expect(result.current.mode).toBe("loop-track");
    expect(result.current.selectedTrackId).toBe("track-2");
    expect(result.current.volume).toBe(0.8);
  });

  it("actualiza el volumen y lo guarda en localStorage", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.setVolume(0.75);
    });

    expect(result.current.volume).toBe(0.75);
    expect(localStorage.getItem("audioVolume")).toBe("0.75");
    expect(mockAudioInstance.volume).toBe(0.75);
  });

  it("cambia de modo y reinicia el índice de reproducción", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.setMode("playlist");
    });

    expect(result.current.mode).toBe("playlist");
    expect(result.current.currentTrackIndex).toBe(0);
    expect(localStorage.getItem("audioMode")).toBe("playlist");
  });

  it("devuelve el título de la canción actual según el modo activo", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.setMode("loop-track");
      result.current.setSelectedTrackId("track-2");
    });
    expect(result.current.currentTrackTitle).toBe("Pista 2");

    act(() => {
      result.current.setMode("playlist");
    });
    expect(result.current.currentTrackTitle).toBe("Pista 1");
  });

  it("no altera la reproducción en togglePlay si el modo está en OFF", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.togglePlay();
    });

    expect(mockAudioInstance.play).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("pausa el reproductor cuando el modo se cambia a OFF", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.setMode("loop-track");
    });

    act(() => {
      result.current.setMode("off");
    });

    expect(mockAudioInstance.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });
});