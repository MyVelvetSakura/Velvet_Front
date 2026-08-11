import { describe, it, expect, vi, beforeEach } from "vitest";
import apiProgress from "./apiProgress";
import httpClient from "./httpClient";

vi.mock("./httpClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("apiProgress Service", () => {
  const service = apiProgress();
  const accountId = "usr-777";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProgress", () => {
    it("obtiene el progreso del usuario correctamente mediante GET", async () => {
      const mockProgressData = {
        level: 5,
        experience: 1200,
        streak: 3,
      };

      httpClient.get.mockResolvedValueOnce({ data: mockProgressData });

      const result = await service.getProgress(accountId);

      expect(httpClient.get).toHaveBeenCalledWith(`/progress/${accountId}`);
      expect(result).toEqual(mockProgressData);
    });

    it("propaga el error si la llamada a getProgress falla", async () => {
      const mockError = new Error("Error al obtener el progreso");
      httpClient.get.mockRejectedValueOnce(mockError);

      await expect(service.getProgress(accountId)).rejects.toThrow(
        "Error al obtener el progreso"
      );
    });
  });

  describe("getAchievements", () => {
    it("obtiene la lista de logros del usuario correctamente", async () => {
      const mockAchievements = [
        { id: "ach-1", title: "Primera Lectura", unlocked: true },
        { id: "ach-2", title: "Maestro del Tarot", unlocked: false },
      ];

      httpClient.get.mockResolvedValueOnce({ data: mockAchievements });

      const result = await service.getAchievements(accountId);

      expect(httpClient.get).toHaveBeenCalledWith(
        `/progress/${accountId}/achievements`
      );
      expect(result).toEqual(mockAchievements);
    });

    it("propaga el error si falla la llamada a getAchievements", async () => {
      httpClient.get.mockRejectedValueOnce(new Error("Error de red"));

      await expect(service.getAchievements(accountId)).rejects.toThrow(
        "Error de red"
      );
    });
  });

  describe("spendForRetry", () => {
    it("realiza la petición POST para consumir un reintento y devuelve boolean", async () => {
      httpClient.post.mockResolvedValueOnce({ data: true });

      const result = await service.spendForRetry(accountId);

      expect(httpClient.post).toHaveBeenCalledWith(
        `/progress/${accountId}/spend-retry`
      );
      expect(result).toBe(true);
    });

    it("propaga el error si la petición para reintentar falla", async () => {
      httpClient.post.mockRejectedValueOnce(new Error("Saldo insuficiente"));

      await expect(service.spendForRetry(accountId)).rejects.toThrow(
        "Saldo insuficiente"
      );
    });
  });
});