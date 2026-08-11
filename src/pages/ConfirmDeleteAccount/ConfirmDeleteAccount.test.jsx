import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import apiAccount from "../../services/apiAccount";

const mockNavigate = vi.fn();
const mockGetSearchParams = vi.fn();

vi.mock("react-router", () => ({
  useSearchParams: () => [{ get: mockGetSearchParams }],
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../hooks/useToast", () => ({
  default: vi.fn(),
}));

vi.mock("../../services/apiAccount", () => ({
  default: vi.fn(),
}));

describe("ConfirmDeleteAccount Component", () => {
  const mockLogout = vi.fn();
  const mockToastSuccess = vi.fn();
  const mockToastError = vi.fn();
  const mockConfirmAccountDeletion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    useAuth.mockReturnValue({ logout: mockLogout });
    useToast.mockReturnValue({
      toast: { success: mockToastSuccess, error: mockToastError },
    });
    apiAccount.mockReturnValue({
      confirmAccountDeletion: mockConfirmAccountDeletion,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renderiza el estado de advertencia inicial", () => {
    mockGetSearchParams.mockReturnValue("valid-token-123");

    render(<ConfirmDeleteAccount />);

    expect(
      screen.getByText(/Esta es tu última oportunidad para cancelar/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sí, eliminar mi cuenta definitivamente/i })
    ).toBeInTheDocument();
  });

  it("cambia a estado de error directamente si no hay token en los URLSearchParams", () => {
    mockGetSearchParams.mockReturnValue(null);

    render(<ConfirmDeleteAccount />);

    const confirmButton = screen.getByRole("button", {
      name: /Sí, eliminar mi cuenta definitivamente/i,
    });
    fireEvent.click(confirmButton);

    expect(
      screen.getByText("El enlace no es válido o ha caducado.")
    ).toBeInTheDocument();
    expect(mockConfirmAccountDeletion).not.toHaveBeenCalled();
  });

  it("elimina la cuenta con éxito, hace logout, muestra toast y redirige tras 2.5 segundos", async () => {
    mockGetSearchParams.mockReturnValue("valid-token-123");
    mockConfirmAccountDeletion.mockResolvedValueOnce({});

    render(<ConfirmDeleteAccount />);

    const confirmButton = screen.getByRole("button", {
      name: /Sí, eliminar mi cuenta definitivamente/i,
    });

    fireEvent.click(confirmButton);

    expect(screen.getByText("Eliminando tu cuenta...")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(
      screen.getByText("Tu cuenta ha sido eliminada. Gracias por haber usado Velvet Sakura.")
    ).toBeInTheDocument();
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockToastSuccess).toHaveBeenCalledWith("Tu cuenta ha sido eliminada");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("muestra el mensaje de error de la API cuando la promesa falla con un string de respuesta", async () => {
    mockGetSearchParams.mockReturnValue("expired-token");
    mockConfirmAccountDeletion.mockRejectedValueOnce({
      response: { data: "El token de eliminación ha caducado" },
    });

    render(<ConfirmDeleteAccount />);

    const confirmButton = screen.getByRole("button", {
      name: /Sí, eliminar mi cuenta definitivamente/i,
    });

    fireEvent.click(confirmButton);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(
      screen.getByText("El enlace no es válido o ha caducado.")
    ).toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith("El token de eliminación ha caducado");
  });

  it("muestra un mensaje de error por defecto cuando el error de la API no contiene un string", async () => {
    mockGetSearchParams.mockReturnValue("invalid-token");
    mockConfirmAccountDeletion.mockRejectedValueOnce(new Error("Error de red"));

    render(<ConfirmDeleteAccount />);

    const confirmButton = screen.getByRole("button", {
      name: /Sí, eliminar mi cuenta definitivamente/i,
    });

    fireEvent.click(confirmButton);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(
      screen.getByText("El enlace no es válido o ha caducado.")
    ).toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith("No se pudo eliminar la cuenta");
  });
});