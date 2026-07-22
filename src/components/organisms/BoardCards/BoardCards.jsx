import styles from "./board-card.module.css";
import { useEffect, useState } from "react";
import Deck from "../../molecules/Deck/Deck";
import { apiSakura } from "../../../services/api";
import { useNavigate } from "react-router";
import apiProgress from "../../../services/apiProgress";
import useToast from "../../../hooks/useToast";

const RETRY_COST = 15;

const BoardCards = ({ deckType, question, user }) => {
  const [deck, setDeck] = useState([]);
  const [masterDeck, setMasterDeck] = useState([]);
  const navigate = useNavigate();
  const [slots, setSlots] = useState({
    past: null,
    present: null,
    future: null,
  });

  const canReveal = slots.past && slots.present && slots.future;
  const [revealed, setRevealed] = useState(false);
  const { toast } = useToast();

   useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiSakura().getDeck(deckType);
        const uniqueDeck = Object.values(
          data.reduce((acc, card) => {
            acc[card.id] = card;
            return acc;
          }, {})
        );
        setDeck(uniqueDeck);
        setMasterDeck(uniqueDeck);
      } catch (error) {
        console.error("Error cargando el mazo:", error);
      }
    };
    loadData();
  }, [deckType]);

  const placeCard = (card) => {
    const usedIds = [slots.past?.id, slots.present?.id, slots.future?.id];
    if (usedIds.includes(card.id)) return;
    if (slots.past && slots.present && slots.future) return;

    setSlots((prev) => {
      if (!prev.past) return { ...prev, past: card };
      if (!prev.present) return { ...prev, present: card };
      if (!prev.future) return { ...prev, future: card };
      return prev;
    });

    setDeck((prev) => prev.filter((c) => c.id !== card.id));
  };

  const handleButtonClick = () => {
        if (!revealed) {
            setRevealed(true);
        } else {
            navigate("/tarot-result", {
                state: {
                    past: slots.past,
                    present: slots.present,
                    future: slots.future,
                    deckType,
                    question,
                }
            });
        }
    };


  const shuffleDeck = (newDeck) => {
    const deckToShuffle = newDeck ? [...newDeck] : [...deck];
    setDeck(deckToShuffle.sort(() => Math.random() - 0.5));
  };

  const resetGame = async () => {
    console.log("resetGame ejecutado, user:", user);
        try {
            const dbProgress = apiProgress();
            const canRetry = await dbProgress.spendForRetry(user.id);
            if (!canRetry) {
                toast.error(`Necesitas ${RETRY_COST} Plumas de Yue para reiniciar la tirada`);
                return;
            }
            setSlots({ past: null, present: null, future: null });
            setRevealed(false);
            shuffleDeck(masterDeck);
            toast.success(`Tirada reiniciada. -${RETRY_COST} 🪶`);
        } catch (error) {
            toast.error("No se pudo procesar el reinicio");
        }
    };

    
  return (
    <>
      <div className={styles.container_board}>
        <div className={styles.board}>
          <div className={styles.slot}>
            <span className={styles.reading}>Pasado</span>
            {slots.past && (
              <div
                className={`${styles.card} ${revealed ? styles.flipped : ""}`}
              >
                <div className={styles.card_inner}>
                  <div className={`${styles.card_face} ${styles.card_back}`}>
                    <img src={slots.past.sakuraReverse} alt="Reverso" />{" "}
                  </div>
                  <div className={`${styles.card_face} ${styles.card_front}`}>
                    <img src={slots.past.sakuraCard} alt="Pasado" />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>

          <div className={styles.slot}>
            <span className={styles.reading}>Presente</span>
            {slots.present && (
              <div
                className={`${styles.card} ${revealed ? styles.flipped : ""}`}
              >
                <div className={styles.card_inner}>
                  <div className={`${styles.card_face} ${styles.card_back}`}>
                    <img src={slots.present.sakuraReverse} alt="Reverso" />{" "}
                  </div>
                  <div className={`${styles.card_face} ${styles.card_front}`}>
                    <img src={slots.present.sakuraCard} alt="Presente" />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>

          <div className={styles.slot}>
            <span className={styles.reading}>Futuro</span>
            {slots.future && (
              <div
                className={`${styles.card} ${revealed ? styles.flipped : ""}`}
              >
                <div className={styles.card_inner}>
                  <div className={`${styles.card_face} ${styles.card_back}`}>
                    <img src={slots.future.sakuraReverse} alt="Reverso" />{" "}
                  </div>
                  <div className={`${styles.card_face} ${styles.card_front}`}>
                    <img src={slots.future.sakuraCard} alt="Futuro" />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>
        </div>

        {deck.length > 0 && (
          <div className={styles.deck_wrapper}>
            <Deck
              deck={deck}
              onCardClick={placeCard}
              onShuffle={shuffleDeck}
              slots={slots}
              placeCard={placeCard}
            />
          </div>
        )}
        <div className={styles.field_btn}>
          <input
            type="button"
            className={styles.subm_btn}
            value={revealed ? "Continuar" : "Revelar"}
            onClick={handleButtonClick}
            disabled={!canReveal && !revealed}
          />

          <input
            type="button"
            className={styles.reset_btn}
            value="Reiniciar"
            onClick={resetGame}
          />
        </div>
      </div>
    </>
  );
};
export default BoardCards;
