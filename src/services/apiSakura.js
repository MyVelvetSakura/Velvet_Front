import httpClient from "./httpClient";

export const apiSakura = () => {
  const getDeck = async (deckType = "SAKURA") => {
    try {
      const response = await httpClient.get("/cards", { params: { deckType } });
      return response.data.map((card) => ({
        id: card.id,
        spanishName: card.spanishName,
        sakuraCard: card.cardImageUrl,
        sakuraReverse: card.reverseImageUrl,
        meaning: card.meaning,
      }));
    } catch (error) {
      console.error("Error al obtener las cartas:", error);
      throw error;
    }
  };

  const getCardById = async (id) => {
    try {
      const response = await httpClient.get(`/cards/${id}`);
      const card = response.data;
      return {
        spanishName: card.spanishName,
        sakuraCard: card.cardImageUrl,
        meaning: card.meaning,
      };
    } catch (error) {
      console.error(`Error al obtener la carta con el id ${id}:`, error);
      throw error;
    }
  };

  return { getDeck, getCardById };
};