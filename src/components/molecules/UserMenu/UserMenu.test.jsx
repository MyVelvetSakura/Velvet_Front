import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("UserMenu Component", () => {
  const mockNavigate = vi.fn();
  const mockOnLogout = vi.fn();

  const mockUser = {
    name: "Sakura Kinomoto",
  };
  const mockAvatarSrc = "/src/assets/images/avatars/sakura.png";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  describe("Renderizado inicial", () => {
    it("muestra el nombre del usuario y la imagen del avatar", () => {
      const { container } = render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      expect(screen.getByText("Sakura Kinomoto")).toBeInTheDocument();

      const avatar = container.querySelector("img");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", mockAvatarSrc);
    });

    it("no muestra el menú desplegable por defecto", () => {
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Elegir cartas" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Interacción con el Menú Desplegable", () => {
    it("abre y cierra el menú desplegable al hacer clic en el disparador", async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      const triggerBtn = screen.getByRole("button", {
        name: /sakura kinomoto/i,
      });

      await user.click(triggerBtn);
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Elegir cartas" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Historial" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Mi perfil" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Desconectar" }),
      ).toBeInTheDocument();

      await user.click(triggerBtn);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("cierra el menú al hacer clic fuera del componente (Outside Click)", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button data-testid="outside-element">Elemento Exterior</button>
          <UserMenu
            user={mockUser}
            avatarSrc={mockAvatarSrc}
            onLogout={mockOnLogout}
          />
        </div>,
      );

      await user.click(
        screen.getByRole("button", { name: /sakura kinomoto/i }),
      );
      expect(screen.getByRole("list")).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId("outside-element"));

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("Navegación y Acciones del Menú", () => {
    it('navega a "/readings" y cierra el menú al seleccionar "Elegir cartas"', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /sakura kinomoto/i }),
      );
      await user.click(screen.getByRole("button", { name: "Elegir cartas" }));

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/readings");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it('navega a "/history" y cierra el menú al seleccionar "Historial"', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /sakura kinomoto/i }),
      );
      await user.click(screen.getByRole("button", { name: "Historial" }));

      expect(mockNavigate).toHaveBeenCalledWith("/history");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it('navega a "/profile-settings" y cierra el menú al seleccionar "Mi perfil"', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /sakura kinomoto/i }),
      );
      await user.click(screen.getByRole("button", { name: "Mi perfil" }));

      expect(mockNavigate).toHaveBeenCalledWith("/profile-settings");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it('ejecuta onLogout() y cierra el menú al hacer clic en "Desconectar"', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          user={mockUser}
          avatarSrc={mockAvatarSrc}
          onLogout={mockOnLogout}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /sakura kinomoto/i }),
      );
      await user.click(screen.getByRole("button", { name: "Desconectar" }));

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});
