import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

vi.mock("../../components/organisms/LoginForm/LogForm", () => ({
  default: () => <div data-testid="mock-log-form">LogForm Component</div>,
}));

describe("Home Component", () => {
  it("renderiza el título para iniciar sesión o registrarse", () => {
    render(<Home />);

    const titleElement = screen.getByRole("heading", {
      level: 3,
      name: /Inicia sesión o regístrate como nuevo usuario/i,
    });

    expect(titleElement).toBeInTheDocument();
  });

  it("renderiza el componente LogForm dentro de la sección", () => {
    render(<Home />);

    const logFormMock = screen.getByTestId("mock-log-form");
    
    expect(logFormMock).toBeInTheDocument();
    expect(logFormMock.closest("section")).toBeInTheDocument();
  });
});