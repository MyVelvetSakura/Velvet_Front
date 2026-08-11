import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Intro from "./Intro";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Intro Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza la primera diapositiva por defecto", () => {
    render(<Intro />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Bienvenid@ a Velvet Sakura/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Un rincón mágico inspirado en Cardcaptor Sakura/i)
    ).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: /Atrás/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Siguiente/i })).toBeInTheDocument();
  });

  it("avanza a la siguiente diapositiva y muestra el botón 'Atrás'", () => {
    render(<Intro />);

    const nextButton = screen.getByRole("button", { name: /Siguiente/i });
    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", { level: 2, name: /Elige tu mazo/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Atrás/i })).toBeInTheDocument();
  });

  it("retrocede a la diapositiva anterior al hacer clic en 'Atrás'", () => {
    render(<Intro />);

    const nextButton = screen.getByRole("button", { name: /Siguiente/i });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /Atrás/i });
    fireEvent.click(prevButton);

    expect(
      screen.getByRole("heading", { level: 2, name: /Bienvenid@ a Velvet Sakura/i })
    ).toBeInTheDocument();
  });

  it("navega directamente a una diapositiva al hacer clic en los dots de paginación", () => {
    render(<Intro />);

    const dotStep4 = screen.getByRole("button", { name: "Ir al paso 4" });
    fireEvent.click(dotStep4);

    expect(
      screen.getByRole("heading", { level: 2, name: /Pasado, presente y futuro/i })
    ).toBeInTheDocument();
  });

  it("guarda en localStorage y navega a /home al hacer clic en 'Saltar intro'", () => {
    render(<Intro />);

    const skipButton = screen.getByRole("button", { name: /Saltar intro/i });
    fireEvent.click(skipButton);

    expect(localStorage.getItem("hasSeenIntro")).toBe("true");
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("muestra el botón 'Empezar' en la última diapositiva y completa la intro al hacer clic", () => {
    render(<Intro />);

    const lastDot = screen.getByRole("button", { name: "Ir al paso 6" });
    fireEvent.click(lastDot);

    expect(
      screen.getByRole("heading", { level: 2, name: /Progresa con cada tirada/i })
    ).toBeInTheDocument();

    const startButton = screen.getByRole("button", { name: /Empezar/i });
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);

    expect(localStorage.getItem("hasSeenIntro")).toBe("true");
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });
});