import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import styles from "./saved-reading.module.css";
import Button from "../../atoms/Button/Button";
import ArrowLeft from "../../../assets/images/flecha_izquierda.png";
import ArrowRight from "../../../assets/images/flecha_derecha.png";
import { useNavigate } from "react-router";
import { apiSakura } from "../../../services/api";
import apiReading from "../../../services/apiReading";
import Modal from "../../molecules/Modal/Modal";
import useToast from "../../../hooks/useToast";
import InterpretationModalBackground from "../../molecules/InterpretationModalBackground/InterpretationModalBackground";

const SavedReading = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getCardById } = apiSakura();
  const dbReadings = apiReading();
  const [cards, setCards] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();
  const [readingData, setReadingData] = useState(null);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!state) return;

    const loadCards = async () => {
      try {
        const past = await getCardById(state.past);
        const present = await getCardById(state.present);
        const future = await getCardById(state.future);

        setCards([
          { ...past, stage: "Pasado" },
          { ...present, stage: "Presente" },
          { ...future, stage: "Futuro" },
        ]);

        const reading = await dbReadings.getById(state.id);
        setReadingData(reading);
      } catch (error) {
        console.error("Error cargando cartas:", error);
      }
    };
    loadCards();
  }, [state]);

  if (!state || cards.length === 0) {
    return <p>Cargando lectura...</p>;
  }

  const showActions =
    !isMobile || (isMobile && currentIndex === cards.length - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handleDelete = async () => {
    try {
      await dbReadings.deleteReading(state.id);
      toast.success("Lectura eliminada");
      navigate("/history", { replace: true });
    } catch (error) {
      console.error("Error al eliminar la lectura:", error);
      toast.error("Error al eliminar la lectura");
    }
  };

  return (
    <>
      <div className={styles.desktop}>
        {cards.map((card) => (
          <div key={card.stage} className={styles.card_block}>
            <h3 className={styles.card_title}>{card.stage}</h3>
            <h4 className={styles.card_name}>
              {card.spanishName.toUpperCase()}
            </h4>
            <img
              src={card.sakuraCard}
              alt={card.spanishName}
              className={styles.card_image}
            />
            <div className={styles.box_meaning}>
              <p className={styles.description}>{card.meaning}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mobile}>
        <h3 className={styles.card_title}>{cards[currentIndex].stage}</h3>
        <div className={styles.mobile_card}>
          {currentIndex !== 0 && (
            <button className={styles.arrow_left} onClick={handlePrev}>
              <img src={ArrowLeft} alt="Izquierda" />
            </button>
          )}

          <div>
            <h4 className={styles.card_name}>
              {cards[currentIndex].spanishName.toUpperCase()}
            </h4>
            <img
              src={cards[currentIndex].sakuraCard}
              alt={cards[currentIndex].spanishName}
              className={styles.card_image}
            />
          </div>
          {currentIndex !== cards.length - 1 && (
            <button className={styles.arrow_right} onClick={handleNext}>
              <img src={ArrowRight} alt="Derecha" />
            </button>
          )}
        </div>

        <div className={styles.box_meaning}>
          <p className={styles.description}>{cards[currentIndex].meaning}</p>
        </div>
      </div>

      {showActions && (
        <>
          {readingData?.interpretation && (
            <div className={styles.interpretationTrigger}>
              <button
                className={styles.interpretationBtn}
                onClick={() => setIsInterpretationModalOpen(true)}
              >
                🔮 Ver la respuesta de las cartas
              </button>
            </div>
          )}

          <div className={styles.actions}>
            <input
              className={styles.subm_btn}
              type="button"
              value="Eliminar"
              onClick={() => setIsDeleteConfirmOpen(true)}
            />
            <Button text="Atrás" BtnClass={styles.reset_btn} path="/history" />
          </div>
        </>
      )}

      {isInterpretationModalOpen && (
        <Modal
          title="La respuesta de las cartas"
          onClose={() => setIsInterpretationModalOpen(false)}
          background={<InterpretationModalBackground />}
          actions={
            <button
              className={styles.subm_btn}
              onClick={() => setIsInterpretationModalOpen(false)}
            >
              Cerrar
            </button>
          }
        >
          <p className={styles.interpretationText}>
            {readingData?.interpretation}
          </p>
        </Modal>
      )}

      {isDeleteConfirmOpen && (
        <Modal
          title="¿Eliminar esta lectura?"
          onClose={() => setIsDeleteConfirmOpen(false)}
          actions={
            <>
              <button className={styles.subm_btn} onClick={handleDelete}>
                Confirmar
              </button>
              <button
                className={styles.reset_btn}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancelar
              </button>
            </>
          }
        >
          <p>Esta acción no se puede deshacer.</p>
        </Modal>
      )}
    </>
  );
};

export default SavedReading;