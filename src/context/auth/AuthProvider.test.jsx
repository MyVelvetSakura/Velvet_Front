import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";

describe("AuthProvider Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const useCustomHook = () => useContext(AuthContext);

  it("inicializa 'user' como null si no hay datos en localStorage", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
  });

  it("inicializa 'user' leyendo y parseando el objeto desde localStorage si existe", () => {
    const mockUser = { id: "123", name: "Sakura", email: "sakura@test.com" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it("ejecuta 'login' actualizando el estado y guardando usuario y token en localStorage", () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AuthProvider,
    });

    const userToLogin = { id: "123", name: "Sakura" };
    const token = "mock-jwt-token-xyz";

    act(() => {
      result.current.login(userToLogin, token);
    });

    expect(result.current.user).toEqual(userToLogin);

    expect(localStorage.getItem("user")).toBe(JSON.stringify(userToLogin));
    expect(localStorage.getItem("token")).toBe(token);
  });

  it("ejecuta 'updateUser' actualizando parcialmente las propiedades del usuario en estado y localStorage", () => {
    const initialUser = { id: "123", name: "Sakura", role: "user" };
    localStorage.setItem("user", JSON.stringify(initialUser));

    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.updateUser({ name: "Sakura Kinomoto", role: "admin" });
    });

    const expectedUpdatedUser = { id: "123", name: "Sakura Kinomoto", role: "admin" };

    expect(result.current.user).toEqual(expectedUpdatedUser);

    expect(localStorage.getItem("user")).toBe(JSON.stringify(expectedUpdatedUser));
  });

  it("ejecuta 'logout' reseteando el estado de usuario a null y borrando user y token de localStorage", () => {
    const mockUser = { id: "123", name: "Sakura" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-token-abc");

    const { result } = renderHook(() => useCustomHook(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});