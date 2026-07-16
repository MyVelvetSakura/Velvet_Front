import { useState } from "react";
import styles from "./deck.module.css";

const Deck = ({ deck, onCardClick, onShuffle, slots = {}, placeCard }) => {

    const [isShuffling, setIsShuffling] = useState(false);
    const [lastSelectedId, setLastSelectedId] = useState(null);

    const selectCard = (card) => {
        setLastSelectedId(card.id);
        setTimeout(() => {
            onCardClick(card);
            setLastSelectedId(null);
        }, 300);
    };

    const shuffleDeck = () => {
        setIsShuffling(true);
        onShuffle();
        setTimeout(() => setIsShuffling(false), 500);
    };

    const isDeckDisabled = slots.past && slots.present && slots.future;

    return (
        <>
            <div className={styles.mobile_section}>
                <section className={styles.deck_section}>
                    <button className={styles.shuffle_btn} onClick={shuffleDeck} type="button">
                        Barajar
                    </button>

                    <div className={`${styles.stacked_deck_container} ${isShuffling ? styles.shuffling_flash : ""}`}>
                        {deck.map((card, index) => (
                            <div
                                key={card.id}
                                className={`${styles.card_stacked} ${lastSelectedId === card.id ? styles.card_ghost : ""}`}
                                style={{ "--i": index }}
                                onClick={() => !isDeckDisabled && selectCard(card)}
                            >
                                <img src={card.sakuraReverse} alt="Reverse card" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className={styles.desktop_section}>
                <div className={styles.banner}>
                    <div className={styles.deck_desktop}>
                        {deck.map((card, index) => (
                            <div key={card.id}
                                className={styles.deck_card}
                                style={{
                                    "--position": index + 1,
                                    "--quantity": deck.length
                                }}
                                onClick={() => {
                                    if (!isDeckDisabled) placeCard(card);
                                }}>
                                <img src={card.sakuraReverse} alt="Reverso" />
                            </div>))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Deck;
