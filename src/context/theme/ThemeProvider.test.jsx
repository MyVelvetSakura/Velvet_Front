import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";

describe("ThemeProvider Component", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  const useCustomHook = () => useContext(ThemeContext);

  it("inicializa el tema como 'sakura' por defecto y lo asigna en el DOM", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("sakura");

    expect(document.documentElement.getAttribute("data-theme")).toBe("sakura");
  });

  it("actualiza el tema a 'clow' y sincroniza el atributo data-theme en el DOM", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("clow");
    });

    expect(result.current.theme).toBe("clow");
    expect(document.documentElement.getAttribute("data-theme")).toBe("clow");
  });

  it("permite cambiar entre temas ('sakura' y 'clow') de forma consecutiva", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("clow");
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("clow");

    act(() => {
      result.current.setTheme("sakura");
    });
    expect(result.current.theme).toBe("sakura");
    expect(document.documentElement.getAttribute("data-theme")).toBe("sakura");
  });
});