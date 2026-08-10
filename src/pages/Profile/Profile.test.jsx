import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Profile from "./Profile";

const mockUpdateUser = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();
const mockEditAccount = vi.fn();
const mockUpdateAvatar = vi.fn();
const mockRequestAccountDeletion = vi.fn();
const mockGetProgress = vi.fn();
const mockGetAchievements = vi.fn();

const mockUser = {
  id: 1,
  name: "Ragnarok1",
  email: "ragnarok1@gmail.com",
  avatarKey: "default",
};

vi.mock("../../hooks/useAuth", () => ({
  default: () => ({ user: mockUser, updateUser: mockUpdateUser }),
}));

vi.mock("../../hooks/useToast", () => ({
  default: () => ({
    toast: { error: mockToastError, success: mockToastSuccess },
  }),
}));

vi.mock("../../services/apiAccount", () => ({
  default: () => ({
    editAccount: mockEditAccount,
    updateAvatar: mockUpdateAvatar,
    requestAccountDeletion: mockRequestAccountDeletion,
  }),
}));

vi.mock("../../services/apiProgress", () => ({
  default: () => ({
    getProgress: mockGetProgress,
    getAchievements: mockGetAchievements,
  }),
}));

const renderProfile = () =>
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProgress.mockResolvedValue({
      level: 2,
      experience: 30,
      experienceToNextLevel: 70,
      credits: 15,
      totalReadings: 5,
    });
    mockGetAchievements.mockResolvedValue([]);
  });

  it("renderiza el nombre de usuario actual", () => {
    renderProfile();

    expect(screen.getByText("Ragnarok1")).toBeInTheDocument();
  });

  it("renderiza el progreso del usuario tras cargarlo", async () => {
    renderProfile();

    expect(await screen.findByText(/nivel 2/i)).toBeInTheDocument();
    expect(screen.getByText(/lecturas realizadas: 5/i)).toBeInTheDocument();
  });

  it("muestra el input de edición al pulsar el botón de editar nombre", async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByRole("button", { name: "Editar nombre" }));
    expect(screen.getByDisplayValue("Ragnarok1")).toBeInTheDocument();
  });

  it("actualiza el nombre correctamente al guardar", async () => {
    const user = userEvent.setup();
    mockEditAccount.mockResolvedValueOnce({ name: "NuevoNombre" });

    renderProfile();

    await user.click(screen.getByRole("button", { name: "Editar nombre" }));
    const input = screen.getByDisplayValue("Ragnarok1");
    await user.clear(input);
    await user.type(input, "NuevoNombre");
    await user.click(screen.getByRole("button", { name: /guardar|check|✓/i }));

    expect(mockEditAccount).toHaveBeenCalledWith(1, "NuevoNombre");
    expect(mockUpdateUser).toHaveBeenCalledWith({ name: "NuevoNombre" });
    expect(mockToastSuccess).toHaveBeenCalledWith("Nombre actualizado");
  });

  it("muestra un error si el nombre ya existe", async () => {
    const user = userEvent.setup();
    mockEditAccount.mockRejectedValueOnce({ response: { status: 400 } });

    renderProfile();

    await user.click(screen.getByRole("button", { name: "Editar nombre" }));
    const input = screen.getByDisplayValue("Ragnarok1");
    await user.clear(input);
    await user.type(input, "NombreOcupado");
    await user.click(screen.getByRole("button", { name: /guardar|check|✓/i }));

    expect(await screen.findByText(/el nombre ya existe/i)).toBeInTheDocument();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("no llama a la API si el nombre no cambió", async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByRole("button", { name: "Editar nombre" }));
    await user.click(screen.getByRole("button", { name: /guardar|check|✓/i }));

    expect(mockEditAccount).not.toHaveBeenCalled();
  });

  it('abre el modal de avatares al pulsar "Cambiar avatar"', async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByText(/cambiar avatar/i));

    expect(screen.getByText(/elige tu avatar/i)).toBeInTheDocument();
  });

  it("abre el modal de eliminar cuenta al pulsar el botón correspondiente", async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByText(/eliminar mi cuenta/i));

    expect(screen.getByText(/¿eliminar tu cuenta\?/i)).toBeInTheDocument();
  });

  it("muestra un error si se intenta confirmar sin introducir la contraseña", async () => {
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByText(/eliminar mi cuenta/i));
    await user.click(screen.getByText(/enviar email de confirmación/i));

    expect(mockToastError).toHaveBeenCalledWith("Introduce tu contraseña");
    expect(mockRequestAccountDeletion).not.toHaveBeenCalled();
  });

  it("tras solicitar la eliminación con éxito, muestra el mensaje de confirmación en el modal", async () => {
    const user = userEvent.setup();
    mockRequestAccountDeletion.mockResolvedValueOnce({});

    renderProfile();

    await user.click(screen.getByText(/eliminar mi cuenta/i));
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    await user.type(passwordInput, "password123");
    await user.click(screen.getByText(/enviar email de confirmación/i));

    expect(mockRequestAccountDeletion).toHaveBeenCalledWith(1, "password123");
    expect(await screen.findByText(/revisa tu correo/i)).toBeInTheDocument();
    expect(screen.getByText(/te hemos enviado un correo/i)).toBeInTheDocument();
  });

  it("muestra un error si la contraseña de confirmación es incorrecta", async () => {
    const user = userEvent.setup();
    mockRequestAccountDeletion.mockRejectedValueOnce({
      response: { data: "Contraseña incorrecta" },
    });

    renderProfile();

    await user.click(screen.getByText(/eliminar mi cuenta/i));
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    await user.type(passwordInput, "malaContraseña");
    await user.click(screen.getByText(/enviar email de confirmación/i));

    expect(mockToastError).toHaveBeenCalledWith("Contraseña incorrecta");
  });

  it("resetea el modal al cerrarlo tras el paso de confirmación", async () => {
    const user = userEvent.setup();
    mockRequestAccountDeletion.mockResolvedValueOnce({});

    renderProfile();

    await user.click(screen.getByText(/eliminar mi cuenta/i));
    await user.type(screen.getByPlaceholderText(/contraseña/i), "password123");
    await user.click(screen.getByText(/enviar email de confirmación/i));

    await screen.findByText(/revisa tu correo/i);
    await user.click(screen.getByText("Entendido"));

    expect(screen.queryByText(/revisa tu correo/i)).not.toBeInTheDocument();
  });
});
