import { describe, it, expect } from "vitest";
import {
  getCardsFromState,
  getNextIndex,
  getPrevIndex,
  shouldShowActions,
  buildReadingData,
} from "./componentTarotLogic";

describe("SavedReading logic", () => {
  it("returns null if state is missing", () => {
    expect(getCardsFromState(null)).toBe(null);
  });

  it("builds cards with stages from state", () => {
    const state = {
      past: { spanishName: "A" },
      present: { spanishName: "B" },
      future: { spanishName: "C" },
    };

    const cards = getCardsFromState(state);

    expect(cards).toHaveLength(3);
    expect(cards[0].stage).toBe("Pasado");
    expect(cards[1].stage).toBe("Presente");
    expect(cards[2].stage).toBe("Futuro");
  });

  it("cycles next index correctly", () => {
    expect(getNextIndex(0)).toBe(1);
    expect(getNextIndex(2)).toBe(0);
  });

  it("cycles previous index correctly", () => {
    expect(getPrevIndex(0)).toBe(2);
    expect(getPrevIndex(2)).toBe(1);
  });
});

describe("TarotDeck logic", () => {
  it("cycles to next index correctly", () => {
    expect(getNextIndex(0)).toBe(1);
    expect(getNextIndex(2)).toBe(0);
  });

  it("cycles to previous index correctly", () => {
    expect(getPrevIndex(0)).toBe(2);
    expect(getPrevIndex(2)).toBe(1);
  });

  it("shows actions on desktop", () => {
    expect(shouldShowActions(false, "Pasado")).toBe(true);
  });

  it("shows actions on mobile only on Futuro stage", () => {
    expect(shouldShowActions(true, "Pasado")).toBe(false);
    expect(shouldShowActions(true, "Futuro")).toBe(true);
  });

  it("builds reading data correctly", () => {
    const data = buildReadingData({
      user: { id: 1 },
      readingName: "My Reading",
      past: { id: 10 },
      present: { id: 20 },
      future: { id: 30 },
    });

    expect(data).toMatchObject({
      userId: 1,
      name: "My Reading",
      pastCardId: 10,
      presentCardId: 20,
      futureCardId: 30,
    });
  });

  it("throws error when reading name is empty", () => {
    expect(() =>
      buildReadingData({
        user: { id: 1 },
        readingName: "",
        past: { id: 10 },
        present: { id: 20 },
        future: { id: 30 },
      })
    ).toThrow();
  });
});
