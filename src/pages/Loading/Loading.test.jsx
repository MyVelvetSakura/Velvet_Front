import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Loading from "./Loading";
import useAuth from "../../hooks/useAuth";
import { isTokenExpired } from "../../utils/jwt";

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../utils/jwt", () => ({
  isTokenExpired: vi.fn(),
}));

vi.mock("../../components/organisms/LoadingScreen/LoadingScreen", () => ({
  default: ({ progress }) => (
    <div data-testid="mock-loading-screen">Progress: {progress}%</div>
  ),
}));

describe("Loading Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorage.clear();

    useAuth.mockReturnValue({ user: null, logout: mockLogout });

    vi.stubGlobal(
      "Image",
      class {
        set src(url) {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      }
    );
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("actualiza el progreso hasta el 100% al precargar todas las imágenes", async () => {
    render(<Loading />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByTestId("mock-loading-screen")).toHaveTextContent(
      "Progress: 100%"
    );
  });

  it("redirige a /readings si hay usuario, token válido y el token no ha expirado", async () => {
    const mockUser = { id: "123", name: "Sakura" };
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    localStorage.setItem("token", "valid-jwt-token");
    isTokenExpired.mockReturnValue(false);

    render(<Loading />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/readings", { replace: true });
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("redirige a /intro si no ha visto la intro (!hasSeenIntro)", async () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });

    render(<Loading />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/intro", { replace: true });
  });

  it("ejecuta logout y redirige a /home si el token ha expirado pero ya vio la intro", async () => {
    const mockUser = { id: "123", name: "Sakura" };
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    localStorage.setItem("token", "expired-jwt-token");
    localStorage.setItem("hasSeenIntro", "true");
    isTokenExpired.mockReturnValue(true);

    render(<Loading />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("redirige a /home sin hacer logout si no hay usuario ni token pero ya vio la intro", async () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    localStorage.setItem("hasSeenIntro", "true");

    render(<Loading />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });
});