import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import httpClient from "./httpClient";

describe("httpClient Interceptors", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    delete window.location;
    window.location = {
      pathname: "/profile",
      href: "http://localhost:3000/profile",
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe("Request Interceptor", () => {
    it("inyecta el token en las cabeceras de autorización si existe en localStorage", async () => {
      localStorage.setItem("token", "my-secret-jwt");

      const requestHandler = httpClient.interceptors.request.handlers[0].fulfilled;

      const config = { headers: {} };
      const updatedConfig = await requestHandler(config);

      expect(updatedConfig.headers.Authorization).toBe("Bearer my-secret-jwt");
    });

    it("no modifica las cabeceras si no hay token en localStorage", async () => {
      const requestHandler = httpClient.interceptors.request.handlers[0].fulfilled;

      const config = { headers: {} };
      const updatedConfig = await requestHandler(config);

      expect(updatedConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response Interceptor", () => {
    const responseSuccessHandler = httpClient.interceptors.response.handlers[0].fulfilled;
    const responseErrorHandler = httpClient.interceptors.response.handlers[0].rejected;

    it("retorna la respuesta tal cual si es exitosa (2xx)", () => {
      const mockResponse = { data: { success: true }, status: 200 };
      const result = responseSuccessHandler(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it("limpia localStorage y redirige a /home si recibe un 401 y había token almacenado", async () => {
      localStorage.setItem("token", "expired-token");
      localStorage.setItem("user", JSON.stringify({ name: "Sakura" }));
      window.location.pathname = "/profile";

      const mockError = {
        response: { status: 401 },
      };

      await expect(responseErrorHandler(mockError)).rejects.toEqual(mockError);

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(window.location.href).toBe("/home");
    });

    it("limpia localStorage y redirige a /home si recibe un 403 y había token almacenado", async () => {
      localStorage.setItem("token", "forbidden-token");
      window.location.pathname = "/readings";

      const mockError = {
        response: { status: 403 },
      };

      await expect(responseErrorHandler(mockError)).rejects.toEqual(mockError);

      expect(localStorage.getItem("token")).toBeNull();
      expect(window.location.href).toBe("/home");
    });

    it("limpia localStorage pero NO redirige si la ruta actual ya es /home", async () => {
      localStorage.setItem("token", "expired-token");
      window.location.pathname = "/home";

      const mockError = {
        response: { status: 401 },
      };

      await expect(responseErrorHandler(mockError)).rejects.toEqual(mockError);

      expect(localStorage.getItem("token")).toBeNull();
      expect(window.location.href).not.toBe("/home");
    });

    it("NO redirige si da 401 pero NO había token en localStorage previamente", async () => {
      window.location.pathname = "/login";

      const mockError = {
        response: { status: 401 },
      };

      await expect(responseErrorHandler(mockError)).rejects.toEqual(mockError);

      expect(window.location.href).not.toBe("/home");
    });

    it("NO borra localStorage ni redirige para otros códigos de error (ej: 500)", async () => {
      localStorage.setItem("token", "valid-token");
      window.location.pathname = "/profile";

      const mockError = {
        response: { status: 500 },
      };

      await expect(responseErrorHandler(mockError)).rejects.toEqual(mockError);

      expect(localStorage.getItem("token")).toBe("valid-token");
      expect(window.location.href).not.toBe("/home");
    });
  });
});