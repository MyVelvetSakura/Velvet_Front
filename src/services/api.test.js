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
    it("obtiene el mazo de cartas por defecto ('SAKURA') y transforma la respuesta correctamente", async () => {
      const mockBackendResponse = {
        data: [
          {
            id: "1",
            spanishName: "El Viento",
            cardImageUrl: "viento.jpg",
            reverseImageUrl: "reverso.jpg",
            meaning: "Fuerza cambiante",
            extraFieldIgnored: "propiedad no usada",
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

    it("permite enviar un 'deckType' personalizado", async () => {
      httpClient.get.mockResolvedValueOnce({ data: [] });

      await service.getDeck("CLOW");

      expect(httpClient.get).toHaveBeenCalledWith("/cards", {
        params: { deckType: "CLOW" },
      });
    });

    it("registra el error en consola y relanza la excepción si falla la petición", async () => {
      const mockError = new Error("Error de red");
      httpClient.get.mockRejectedValueOnce(mockError);

      await expect(service.getDeck()).rejects.toThrow("Error de red");
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener las cartas:",
        mockError
      );
    });
  });

  describe("getCardById", () => {
    it("obtiene los datos de una carta por ID y los transforma correctamente", async () => {
      const mockCardData = {
        data: {
          id: "card-42",
          spanishName: "La Sombra",
          cardImageUrl: "sombra.jpg",
          meaning: "Misterio y sigilo",
        },
      };

      httpClient.get.mockResolvedValueOnce(mockCardData);

      const result = await service.getCardById("card-42");

      expect(httpClient.get).toHaveBeenCalledWith("/cards/card-42");
      expect(result).toEqual({
        spanishName: "La Sombra",
        sakuraCard: "sombra.jpg",
        meaning: "Misterio y sigilo",
      });
    });

    it("registra el error en consola y relanza la excepción si falla la búsqueda por ID", async () => {
      const mockError = new Error("Carta no encontrada");
      httpClient.get.mockRejectedValueOnce(mockError);

      await expect(service.getCardById("invalid-id")).rejects.toThrow(
        "Carta no encontrada"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener la carta con el id invalid-id:",
        mockError
      );
    });
  });
});