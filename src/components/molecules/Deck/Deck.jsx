import { useState } from "react";
import styles from "./deck.module.css";
import { SHUFFLE_SFX_SRC } from "../../../constants/soundtrack";

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

  const isDeckDisabled = slots.past && slots.present && slots.future;

  const playShuffleSfx = () => {
    const sfx = new Audio(SHUFFLE_SFX_SRC);
    sfx.volume = 0.6;
    sfx.play().catch(() => {});
  };

  const shuffleDeck = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    playShuffleSfx();
    if (onShuffle) onShuffle();

    setTimeout(() => setIsShuffling(false), 800);
  };

  return (
    <>
      <div className={styles.mobile_section}>
        <section className={styles.deck_section}>
          <button
            className={styles.shuffle_btn}
            onClick={shuffleDeck}
            type="button"
            disabled={isShuffling}
          >
            Barajar
          </button>

          <div
            className={`${styles.stacked_deck_container} ${
              isShuffling ? styles.shuffling_active : ""
            }`}
          >
            {deck.map((card, index) => (
              <div
                key={card.id}
                className={`${styles.card_stacked} ${
                  lastSelectedId === card.id ? styles.card_ghost : ""
                }`}
                style={{
                  "--i": index,
                  "--dir": index % 2 === 0 ? 1 : -1, // 1 para pares, -1 para impares
                }}
                onClick={() => !isDeckDisabled && !isShuffling && selectCard(card)}
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
              <div
                key={card.id}
                className={styles.deck_card}
                style={{
                  "--position": index + 1,
                  "--quantity": deck.length,
                }}
                onClick={() => {
                  if (!isDeckDisabled) placeCard(card);
                }}
              >
                <img src={card.sakuraReverse} alt="Reverso" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Deck;