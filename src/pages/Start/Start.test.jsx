import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Start from "./Start";
import useAuth from "../../hooks/useAuth";

const mockUseLocation = vi.fn();

vi.mock("react-router", () => ({
  useLocation: () => mockUseLocation(),
}));

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../components/organisms/DeckSelect/DeckSelect", () => ({
  default: () => <div data-testid="mock-deck-select">DeckSelect Component</div>,
}));

const mockBoardCards = vi.fn();
vi.mock("../../components/organisms/BoardCards/BoardCards", () => ({
  default: (props) => {
    mockBoardCards(props);
    return <div data-testid="mock-board-cards">BoardCards Component</div>;
  },
}));

describe("Start Component", () => {
  const mockUser = { id: "user-123", name: "Sakura" };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
  });

  it("renderiza DeckSelect cuando no hay 'deckType' en el state", () => {
    mockUseLocation.mockReturnValue({
      state: null,
    });

    render(<Start />);

    expect(screen.getByTestId("mock-deck-select")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-board-cards")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renderiza el título y BoardCards cuando 'deckType' está presente", () => {
    mockUseLocation.mockReturnValue({
      state: {
        deckType: "sakura",
        question: "¿Qué me depara el futuro?",
      },
    });

    render(<Start />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Elige 3 cartas para el orden de pasado, presente y futuro/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-board-cards")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-deck-select")).not.toBeInTheDocument();
  });

  it("pasa las props correctas (deckType, question, user) al componente BoardCards", () => {
    const mockState = {
      deckType: "clow",
      question: "¿Tendré éxito hoy?",
    };

    mockUseLocation.mockReturnValue({ state: mockState });

    render(<Start />);

    expect(mockBoardCards).toHaveBeenCalledWith({
      deckType: "clow",
      question: "¿Tendré éxito hoy?",
      user: mockUser,
    });
  });
});