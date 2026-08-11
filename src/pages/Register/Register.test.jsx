import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Register from "./Register";

vi.mock("../../components/organisms/RegisterForm/RegForm", () => ({
  default: () => <div data-testid="mock-reg-form">RegForm Component</div>,
}));

describe("Register Component", () => {
  it("renderiza el título para registrar una nueva cuenta", () => {
    render(<Register />);

    const titleElement = screen.getByRole("heading", {
      level: 3,
      name: /Registra tu nueva cuenta/i,
    });

    expect(titleElement).toBeInTheDocument();
  });

  it("renderiza el componente RegForm dentro de la sección", () => {
    render(<Register />);

    const regFormMock = screen.getByTestId("mock-reg-form");

    expect(regFormMock).toBeInTheDocument();
    expect(regFormMock.closest("section")).toBeInTheDocument();
  });
});