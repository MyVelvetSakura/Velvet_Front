import { describe, it, expect, vi, beforeEach } from "vitest";
import apiInterpretation from "./apiInterpretation";
import httpClient from "./httpClient";

vi.mock("./httpClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("apiInterpretation Service", () => {
  const service = apiInterpretation();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía la pregunta y los IDs de las cartas correctamente al endpoint /interpretation", async () => {
    const mockPayload = {
      question: "¿Cómo irá mi carrera profesional?",
      pastCardId: "card-1",
      presentCardId: "card-2",
      futureCardId: "card-3",
    };

    const mockResponseData = {
      interpretation: "El pasado muestra esfuerzo, el presente cambio y el futuro éxito.",
      readingId: "reading-99",
    };

    httpClient.post.mockResolvedValueOnce({ data: mockResponseData });

    const result = await service.generate(
      mockPayload.question,
      mockPayload.pastCardId,
      mockPayload.presentCardId,
      mockPayload.futureCardId
    );

    expect(httpClient.post).toHaveBeenCalledWith("/interpretation", {
      question: mockPayload.question,
      pastCardId: mockPayload.pastCardId,
      presentCardId: mockPayload.presentCardId,
      futureCardId: mockPayload.futureCardId,
    });

    expect(result).toEqual(mockResponseData);
  });

  it("propaga el error cuando la petición HTTP falla", async () => {
    const mockError = new Error("Error en el servidor de IA / interpretación");
    httpClient.post.mockRejectedValueOnce(mockError);

    await expect(
      service.generate("¿Qué me depara el destino?", "c1", "c2", "c3")
    ).rejects.toThrow("Error en el servidor de IA / interpretación");
  });
});