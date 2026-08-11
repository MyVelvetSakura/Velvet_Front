import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DataResults from "./DataResults";

vi.mock("../../components/organisms/DataForm/DataForm", () => ({
  default: () => <div data-testid="mock-data-form">DataForm Component</div>,
}));

describe("DataResults Component", () => {
  it("renderiza el título de confirmación de registro correctamente", () => {
    render(<DataResults />);

    const titleElement = screen.getByRole("heading", {
      level: 3,
      name: /¡Te has registrado correctamente!/i,
    });

    expect(titleElement).toBeInTheDocument();
  });

  it("renderiza el componente DataForm dentro de una sección", () => {
    render(<DataResults />);

    const dataFormMock = screen.getByTestId("mock-data-form");
    expect(dataFormMock).toBeInTheDocument();

    expect(dataFormMock.closest("section")).toBeInTheDocument();
  });
});