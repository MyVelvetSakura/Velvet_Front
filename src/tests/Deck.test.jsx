import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Deck from "../components/molecules/Deck/Deck";


const mockDeck = [
    { id: 1, sakuraReverse: "url_imagen_1", sakuraCard: "url_frontal_1" },
    { id: 2, sakuraReverse: "url_imagen_2", sakuraCard: "url_frontal_2" }
];

describe("<Deck />", () => {

    test("renders the Deck component and shows the shuffle button", () => {
        render(
            <Deck
                deck={mockDeck}
                onShuffle={() => { }}
                slots={{}}
            />
        );
        const shuffleButton = screen.getByText(/Barajar/i);
        expect(shuffleButton).toBeInTheDocument();
    });

    test("calls onShuffle when the shuffle button is clicked", () => {
        const mockOnShuffle = vi.fn();
        render(
            <Deck
                deck={mockDeck}
                onShuffle={mockOnShuffle}
                slots={{}}
            />
        );

        const shuffleButton = screen.getByText(/Barajar/i);

        fireEvent.click(shuffleButton);
        expect(mockOnShuffle).toHaveBeenCalledTimes(1);
    });

});