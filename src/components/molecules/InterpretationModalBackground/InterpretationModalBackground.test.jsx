import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import InterpretationModalBackground from "./InterpretationModalBackground";

describe("InterpretationModalBackground Component", () => {
  it("renderiza el elemento SVG principal con sus atributos correctos", () => {
    const { container } = render(<InterpretationModalBackground />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 400 500");
    expect(svg).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
  });

  it("renderiza los dos rectángulos del marco (frame e inner frame)", () => {
    const { container } = render(<InterpretationModalBackground />);

    const rects = container.querySelectorAll("rect");
    expect(rects).toHaveLength(2);

    expect(rects[1]).toHaveAttribute("stroke-dasharray", "3 6");
  });

  it("renderiza las 6 líneas del sigilo central", () => {
    const { container } = render(<InterpretationModalBackground />);

    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(6);
  });

  it("renderiza la geometría completa de las 4 flores Sakura (20 pétalos y 4 centros)", () => {
    const { container } = render(<InterpretationModalBackground />);

    const petals = container.querySelectorAll("ellipse");
    expect(petals).toHaveLength(20);
  });

  it("renderiza las 6 estrellas pequeñas y el trazo de la luna", () => {
    const { container } = render(<InterpretationModalBackground />);

    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(7);
  });

  it("coincide con la captura de estructura (Snapshot Test)", () => {
    const { container } = render(<InterpretationModalBackground />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
