import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import History from "./History";
import useAuth from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../components/organisms/historyCards/HistoryCards", () => ({
  default: ({ userId }) => (
    <div data-testid="mock-history-cards">HistoryCards for user: {userId}</div>
  ),
}));

vi.mock("../../components/atoms/ScrollToTopHistory/ScrollToTopHistory", () => ({
  default: () => <div data-testid="mock-scroll-to-top">Scroll To Top</div>,
}));

describe("History Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el mensaje de carga cuando no hay usuario disponible (!user)", () => {
    useAuth.mockReturnValue({ user: null });

    render(<History />);

    expect(screen.getByText("Cargando datos de usuario...")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-history-cards")).not.toBeInTheDocument();
  });

  it("renderiza el mensaje de bienvenida, HistoryCards con userId y ScrollToTopHistory cuando hay usuario", () => {
    const mockUser = { id: "user-123", name: "Sakura" };
    useAuth.mockReturnValue({ user: mockUser });

    render(<History />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Bienvenid@, Sakura, a tu historial de lecturas/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Para eliminar una lectura haz click en Eliminar")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Para borrar el historial haz click en Borrar")
    ).toBeInTheDocument();

    const historyCardsMock = screen.getByTestId("mock-history-cards");
    expect(historyCardsMock).toBeInTheDocument();
    expect(historyCardsMock).toHaveTextContent("HistoryCards for user: user-123");

    expect(screen.getByTestId("mock-scroll-to-top")).toBeInTheDocument();
  });
});