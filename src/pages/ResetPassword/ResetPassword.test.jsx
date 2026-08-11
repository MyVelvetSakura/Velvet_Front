import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import useToast from "../../hooks/useToast";
import apiAccount from "../../services/apiAccount";

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

const mockResetPassword = vi.fn();

vi.mock("../../services/apiAccount", () => ({
  default: () => ({
    resetPassword: mockResetPassword,
  }),
}));

describe("ResetPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los elementos del formulario correctamente", () => {
    mockGetSearchParam.mockReturnValue("valid-token");
    render(<ResetPassword />);

    expect(
      screen.getByRole("heading", { level: 3, name: /Crear nueva contraseña/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nueva contraseña:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirma la contraseña:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Actualizar contraseña/i })
    ).toBeInTheDocument();
  });

  it("muestra un error si no hay token en la URL", () => {
    mockGetSearchParam.mockReturnValue(null);
    render(<ResetPassword />);

    const submitBtn = screen.getByRole("button", { name: /Actualizar contraseña/i });
    fireEvent.click(submitBtn);

    expect(mockToast.error).toHaveBeenCalledWith("Enlace no válido");
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("muestra un error si la contraseña tiene menos de 8 caracteres", () => {
    mockGetSearchParam.mockReturnValue("valid-token");
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/Nueva contraseña:/i);
    const confirmInput = screen.getByLabelText(/Confirma la contraseña:/i);
    const submitBtn = screen.getByRole("button", { name: /Actualizar contraseña/i });

    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.change(confirmInput, { target: { value: "12345" } });
    fireEvent.click(submitBtn);

    expect(mockToast.error).toHaveBeenCalledWith(
      "La contraseña debe tener al menos 8 caracteres"
    );
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("muestra un error si las contraseñas no coinciden", () => {
    mockGetSearchParam.mockReturnValue("valid-token");
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/Nueva contraseña:/i);
    const confirmInput = screen.getByLabelText(/Confirma la contraseña:/i);
    const submitBtn = screen.getByRole("button", { name: /Actualizar contraseña/i });

    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(confirmInput, { target: { value: "87654321" } });
    fireEvent.click(submitBtn);

    expect(mockToast.error).toHaveBeenCalledWith("Las contraseñas no coinciden");
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("actualiza la contraseña correctamente y redirige a /home", async () => {
    mockGetSearchParam.mockReturnValue("valid-token");
    mockResetPassword.mockResolvedValueOnce({ status: 200 });

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/Nueva contraseña:/i);
    const confirmInput = screen.getByLabelText(/Confirma la contraseña:/i);
    const submitBtn = screen.getByRole("button", { name: /Actualizar contraseña/i });

    fireEvent.change(passwordInput, { target: { value: "secreto123" } });
    fireEvent.change(confirmInput, { target: { value: "secreto123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("valid-token", "secreto123");
      expect(mockToast.success).toHaveBeenCalledWith(
        "Contraseña actualizada. Ya puedes iniciar sesión"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
    });
  });

  it("muestra un mensaje de error si la petición a la API falla", async () => {
    mockGetSearchParam.mockReturnValue("expired-token");
    mockResetPassword.mockRejectedValueOnce({
      response: { data: "El token ha expirado" },
    });

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/Nueva contraseña:/i);
    const confirmInput = screen.getByLabelText(/Confirma la contraseña:/i);
    const submitBtn = screen.getByRole("button", { name: /Actualizar contraseña/i });

    fireEvent.change(passwordInput, { target: { value: "secreto123" } });
    fireEvent.change(confirmInput, { target: { value: "secreto123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("El token ha expirado");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});