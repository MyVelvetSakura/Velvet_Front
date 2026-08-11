import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileReading from "./ProfileReading";

const mockUseLocation = vi.fn();

vi.mock("react-router", () => ({
  useLocation: () => mockUseLocation(),
}));

vi.mock("../../components/organisms/SavedReading/SavedReading", () => ({
  default: () => <div data-testid="mock-saved-reading">Saved Reading Component</div>,
}));
vi.mock("../Profile/Profile", () => ({
  default: () => <div data-testid="mock-profile">Profile Fallback Component</div>,
}));

describe("ProfileReading Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título con el nombre y el componente SavedReading cuando existe 'state'", () => {
    mockUseLocation.mockReturnValue({
      state: { name: "de las Cartas Clow" },
    });

    render(<ProfileReading />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Tu lectura de las Cartas Clow/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-saved-reading")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-profile")).not.toBeInTheDocument();
  });

  it("renderiza la vista fallback Profile cuando 'state' es null o undefined", () => {
    mockUseLocation.mockReturnValue({
      state: null,
    });

    render(<ProfileReading />);
    expect(screen.getByTestId("mock-profile")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-saved-reading")).not.toBeInTheDocument();
  });
});