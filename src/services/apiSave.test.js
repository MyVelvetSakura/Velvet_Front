import { describe, it, expect, vi, beforeEach } from "vitest";
import apiSave from "./apiSave";
import axios from "axios";

vi.mock("axios");

describe("apiSave Service", () => {

  const service = apiSave();
  const expectedUrl = "http://localhost:3000/readings";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  describe("getSave", () => {
    it("obtiene las lecturas guardadas correctamente vía GET", async () => {
      const mockReadings = [
        { id: 1, question: "¿Tendré éxito?", cards: ["viento", "sombra"] },
      ];

      axios.get.mockResolvedValueOnce({ data: mockReadings });

      const result = await service.getSave();

      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockReadings);
    });

    it("muestra alerta con el código de estado cuando la API responde con error (error.response)", async () => {
      const mockError = {
        response: { status: 404, data: "Not Found" },
      };
      axios.get.mockRejectedValueOnce(mockError);

      await expect(service.getSave()).rejects.toEqual(mockError);
      expect(window.alert).toHaveBeenCalledWith("Error de la API (404)");
    });

    it("muestra alerta de conexión cuando no hay respuesta del servidor (error.request)", async () => {
      const mockError = {
        request: new XMLHttpRequest(),
      };
      axios.get.mockRejectedValueOnce(mockError);

      await expect(service.getSave()).rejects.toEqual(mockError);
      expect(window.alert).toHaveBeenCalledWith(
        "No se pudo conectar con la base de datos"
      );
    });

    it("muestra alerta de error inesperado ante cualquier otro tipo de fallo", async () => {
      const mockError = new Error("Error genérico de JS");
      axios.get.mockRejectedValueOnce(mockError);

      await expect(service.getSave()).rejects.toThrow("Error genérico de JS");
      expect(window.alert).toHaveBeenCalledWith("Ocurrió un error inesperado");
    });
  });

  describe("saveReading", () => {
    it("envía una nueva lectura vía POST y retorna la respuesta", async () => {
      const newReading = { question: "¿Qué pasará mañana?", cards: [1, 2, 3] };
      const mockResponse = { id: 10, ...newReading };

      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await service.saveReading(newReading);

      expect(axios.post).toHaveBeenCalledWith(expectedUrl, newReading);
      expect(result).toEqual(mockResponse);
    });

    it("propaga el error si falla la petición POST", async () => {
      const mockError = new Error("Error al guardar");
      axios.post.mockRejectedValueOnce(mockError);

      await expect(service.saveReading({})).rejects.toThrow("Error al guardar");
    });
  });
});