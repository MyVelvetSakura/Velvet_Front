import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, screen } from "@testing-library/react";
import { useContext } from "react";
import { ToastProvider } from "./ToastProvider";
import { ToastContext } from "./ToastContext";

vi.mock("../../components/molecules/ToastContainer/ToastContainer", () => ({
  default: ({ toasts, onDismiss }) => (
    <div data-testid="toast-container">
      {toasts.map((t) => (
        <div key={t.id} data-testid={`toast-${t.type}`}>
          <span>{t.message}</span>
          <button onClick={() => onDismiss(t.id)}>Descartar</button>
        </div>
      ))}
    </div>
  ),
}));

describe("ToastProvider Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    let idCounter = 0;
    vi.spyOn(crypto, "randomUUID").mockImplementation(
      () => `uuid-${++idCounter}`
    );
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const useCustomHook = () => useContext(ToastContext);

  it("expone los métodos helper de notificación (success, error, info)", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ToastProvider,
    });

    expect(result.current.toast).toHaveProperty("success");
    expect(result.current.toast).toHaveProperty("error");
    expect(result.current.toast).toHaveProperty("info");
  });

  it("agrega un toast correctamente al llamar a toast.success, error o info", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ToastProvider,
    });

    expect(screen.queryByTestId("toast-success")).not.toBeInTheDocument();

    act(() => {
      result.current.toast.success("Operación exitosa");
      result.current.toast.error("Ocurrió un error");
    });

    expect(screen.getByText("Operación exitosa")).toBeInTheDocument();
    expect(screen.getByText("Ocurrió un error")).toBeInTheDocument();
  });

  it("elimina automáticamente un toast al transcurrir la duración especificada", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.toast.info("Mensaje temporal");
    });

    expect(screen.getByText("Mensaje temporal")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(screen.getByText("Mensaje temporal")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText("Mensaje temporal")).not.toBeInTheDocument();
  });

  it("permite descartar (eliminar) un toast de forma manual mediante la función de borrado", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.toast.info("Toast para eliminar");
    });

    expect(screen.getByText("Toast para eliminar")).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", { name: "Descartar" });
    act(() => {
      dismissButton.click();
    });

    expect(screen.queryByText("Toast para eliminar")).not.toBeInTheDocument();
  });
});