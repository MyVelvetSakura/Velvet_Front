import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TarotResult from "./TarotResult";
import useAuth from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

const mockTarotDeck = vi.fn();
vi.mock("../../components/organisms/TarotDeck/TarotDeck", () => ({
  default: (props) => {
    mockTarotDeck(props);
    return <div data-testid="mock-tarot-deck">TarotDeck Component</div>;
  },
}));

describe("TarotResult Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título 'El sino es revelado'", () => {
    useAuth.mockReturnValue({ user: { id: "123", name: "Sakura" } });

    render(<TarotResult />);

    expect(
      screen.getByRole("heading", { level: 2, name: /El sino es revelado/i })
    ).toBeInTheDocument();
  });

  it("renderiza el componente TarotDeck y le pasa la prop user correctamente", () => {
    const mockUser = { id: "user-456", name: "Kero" };
    useAuth.mockReturnValue({ user: mockUser });

    render(<TarotResult />);

    expect(screen.getByTestId("mock-tarot-deck")).toBeInTheDocument();

    expect(mockTarotDeck).toHaveBeenCalledWith({
      user: mockUser,
    });
  });
});