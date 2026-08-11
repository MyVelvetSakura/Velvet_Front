import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";
import useAuth from "../hooks/useAuth";
import { isTokenExpired } from "../utils/jwt";

vi.mock("react-router", () => ({
  Navigate: ({ to }) => <div data-testid="mock-navigate">Redirigiendo a {to}</div>,
  Outlet: () => <div data-testid="mock-outlet">Contenido Protegido (Outlet)</div>,
}));

const mockLogout = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/jwt", () => ({
  isTokenExpired: vi.fn(),
}));

describe("PrivateRoute Component", () => {
  const mockUser = { id: "123", email: "sakura@clow.com" };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza el <Outlet /> si hay usuario, token y el token NO ha expirado", () => {
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    localStorage.setItem("token", "valid-token-123");
    isTokenExpired.mockReturnValue(false);

    render(<PrivateRoute />);

    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-navigate")).not.toBeInTheDocument();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("redirige a /home si no hay objeto 'user'", () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    localStorage.setItem("token", "valid-token-123");
    isTokenExpired.mockReturnValue(false);

    render(<PrivateRoute />);

    expect(screen.getByTestId("mock-navigate")).toHaveTextContent("Redirigiendo a /home");
    expect(screen.queryByTestId("mock-outlet")).not.toBeInTheDocument();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("redirige a /home si no existe token en localStorage", () => {
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    isTokenExpired.mockReturnValue(false);

    render(<PrivateRoute />);

    expect(screen.getByTestId("mock-navigate")).toHaveTextContent("Redirigiendo a /home");
    expect(screen.queryByTestId("mock-outlet")).not.toBeInTheDocument();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("cierra sesión y redirige a /home si el token ha expirado", () => {
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    localStorage.setItem("token", "expired-token");
    isTokenExpired.mockReturnValue(true);

    render(<PrivateRoute />);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("mock-navigate")).toHaveTextContent("Redirigiendo a /home");
    expect(screen.queryByTestId("mock-outlet")).not.toBeInTheDocument();
  });
});