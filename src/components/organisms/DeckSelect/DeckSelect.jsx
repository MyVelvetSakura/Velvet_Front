import { useState } from "react";
import styles from "./deck-select.module.css";
import useTheme from "../../../hooks/useTheme";
import { useNavigate } from "react-router";

const SAKURA_REVERSE = "https://i.ibb.co/XxrvMJ2/Reverso-Sakura.jpg";
const CLOW_REVERSE = "https://i.ibb.co/LJSmQ4f/Reverso-Clow.jpg";

const DeckSelect = ({ onSelect }) => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleHover = (deck) => {
    setHovered(deck);
  };

  const handleLeave = () => {
    setHovered(null);
  };

 const handleSelect = (deck) => {
    setTheme(deck === "CLOW" ? "clow" : "sakura");
    navigate("/readings/question", { state: { deckType: deck } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Elige el mazo con el que quieres consultar tu destino</h2>

      <div className={styles.options}>
        <div
          className={`${styles.cardWrapper} ${hovered === "SAKURA" ? styles.hovered : ""}`}
          onMouseEnter={() => handleHover("SAKURA")}
          onMouseLeave={handleLeave}
          onClick={() => handleSelect("SAKURA")}
        >
          <div className={styles.sparkles} />
          <img src={SAKURA_REVERSE} alt="Cartas Sakura" className={styles.cardImage} />
          <span className={styles.label}>Cartas Sakura</span>
        </div>

        <div
          className={`${styles.cardWrapper} ${styles.clowCard} ${hovered === "CLOW" ? styles.hovered : ""}`}
          onMouseEnter={() => handleHover("CLOW")}
          onMouseLeave={handleLeave}
          onClick={() => handleSelect("CLOW")}
        >
          <div className={styles.sparkles} />
          <img src={CLOW_REVERSE} alt="Cartas Clow" className={styles.cardImage} />
          <span className={styles.label}>Cartas Clow</span>
        </div>
      </div>
    </div>
  );
};

export default DeckSelect;