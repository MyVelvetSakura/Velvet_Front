import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiSakura } from "./apiSakura";
import httpClient from "./httpClient";

vi.mock("./httpClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("apiSakura Service", () => {
  const service = apiSakura();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getDeck", () => {
    it("obtiene el mazo por defecto ('SAKURA') y mapea los datos correctamente", async () => {
      const mockBackendResponse = {
        data: [
          {
            id: "1",
            spanishName: "El Viento",
            cardImageUrl: "viento.jpg",
            reverseImageUrl: "reverso.jpg",
            meaning: "Fuerza cambiante",
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockBackendResponse);

      const result = await service.getDeck();

      expect(httpClient.get).toHaveBeenCalledWith("/cards", {
        params: { deckType: "SAKURA" },
      });

      expect(result).toEqual([
        {
          id: "1",
          spanishName: "El Viento",
          sakuraCard: "viento.jpg",
          sakuraReverse: "reverso.jpg",
          meaning: "Fuerza cambiante",
        },
      ]);
    });

    it("permite especificar un 'deckType' personalizado", async () => {
      httpClient.get.mockResolvedValueOnce({ data: [] });

      await service.getDeck("CLOW");

      expect(httpClient.get).toHaveBeenCalledWith("/cards", {
        params: { deckType: "CLOW" },
      });
    });

    it("registra el error en consola y relanza la excepción si la llamada falla", async () => {
      const mockError = new Error("Error al obtener cartas");
      httpClient.get.mockRejectedValueOnce(mockError);

      await expect(service.getDeck()).rejects.toThrow("Error al obtener cartas");
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener las cartas:",
        mockError
      );
    });
  });

  describe("getCardById", () => {
    it("obtiene los datos de una carta por ID y los mapea correctamente", async () => {
      const mockCard = {
        data: {
          id: "card-10",
          spanishName: "La Sombra",
          cardImageUrl: "sombra.jpg",
          meaning: "Misterio",
        },
      };

      httpClient.get.mockResolvedValueOnce(mockCard);

      const result = await service.getCardById("card-10");

      expect(httpClient.get).toHaveBeenCalledWith("/cards/card-10");
      expect(result).toEqual({
        spanishName: "La Sombra",
        sakuraCard: "sombra.jpg",
        meaning: "Misterio",
      });
    });

    it("registra el error en consola y relanza la excepción si falla la llamada por ID", async () => {
      const mockError = new Error("Carta no encontrada");
      httpClient.get.mockRejectedValueOnce(mockError);

      await expect(service.getCardById("999")).rejects.toThrow(
        "Carta no encontrada"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener la carta con el id 999:",
        mockError
      );
    });
  });
});