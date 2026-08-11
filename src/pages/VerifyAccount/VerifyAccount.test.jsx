import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import VerifyAccount from "./VerifyAccount";

const mockNavigate = vi.fn();
const mockGetSearchParam = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [{ get: mockGetSearchParam }],
}));

const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
};

vi.mock("../../hooks/useToast", () => ({
  default: () => ({ toast: mockToast }),
}));

const mockVerifyAccount = vi.fn();

vi.mock("../../services/apiAccount", () => ({
  default: () => ({
    verifyAccount: mockVerifyAccount,
  }),
}));

describe("VerifyAccount Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza el estado inicial 'pendiente' con el mensaje y el botón", () => {
    mockGetSearchParam.mockReturnValue("some-token");

    render(<VerifyAccount />);

    expect(
      screen.getByText(/Pulsa el botón para activar tu cuenta/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Verificar mi cuenta/i }),
    ).toBeInTheDocument();
  });

  it("cambia a estado 'error' si se pulsa el botón y no hay token", () => {
    mockGetSearchParam.mockReturnValue(null);

    render(<VerifyAccount />);

    const button = screen.getByRole("button", { name: /Verificar mi cuenta/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/El enlace no es válido o ha caducado/i),
    ).toBeInTheDocument();
    expect(mockVerifyAccount).not.toHaveBeenCalled();
  });

  it("verifica la cuenta con éxito, muestra el mensaje de confirmación y redirige a los 2 segundos", async () => {
    vi.useFakeTimers();
    mockGetSearchParam.mockReturnValue("valid-token");
    mockVerifyAccount.mockResolvedValueOnce({ status: 200 });
    render(<VerifyAccount />);
    const button = screen.getByRole("button", { name: /Verificar mi cuenta/i });
    fireEvent.click(button);
    expect(mockVerifyAccount).toHaveBeenCalledWith("valid-token");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(
      screen.getByText(/¡Cuenta verificada! Redirigiendo.../i),
    ).toBeInTheDocument();
    expect(mockToast.success).toHaveBeenCalledWith(
      "Cuenta verificada correctamente",
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("muestra el estado de error y lanza un toast cuando la API rechaza la verificación", async () => {
    mockGetSearchParam.mockReturnValue("expired-token");
    mockVerifyAccount.mockRejectedValueOnce({
      response: { data: "Token caducado" },
    });

    render(<VerifyAccount />);

    const button = screen.getByRole("button", { name: /Verificar mi cuenta/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/El enlace no es válido o ha caducado/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Si ya intentaste verificar antes/i),
      ).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Token caducado");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
