import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./tarot-deck.module.css";
import Button from "../../atoms/Button/Button";
import ArrowLeft from "../../../assets/images/flecha_izquierda.png";
import ArrowRight from "../../../assets/images/flecha_derecha.png";
import apiReading from "../../../services/apiReading";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Modal from "../../molecules/Modal/Modal";
import useToast from "../../../hooks/useToast";
import apiInterpretation from "../../../services/apiInterpretation";
import InterpretationModalBackground from "../../molecules/InterpretationModalBackground/InterpretationModalBackground";

const TarotDeck = ({ user }) => {
  const { state } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readingName, setReadingName] = useState("");
  const dbReadings = apiReading();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const actualDate = new Date();
  const savedDate = format(actualDate, "dd 'de' MMMM yyyy, HH:mm", {
    locale: es,
  });
  const { toast } = useToast();
  const { past, present, future, deckType, question } = state || {};
  const [interpretation, setInterpretation] = useState("");
  const [loadingInterpretation, setLoadingInterpretation] = useState(false);
  const [isInterpretationModalOpen, setIsInterpretationModalOpen] =
    useState(false);

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
  if (!past || !present || !future) return;

  setLoadingInterpretation(true);
  const db = apiInterpretation();
  db.generate(question || "", past.id, present.id, future.id)
    .then((res) => setInterpretation(res.interpretation))
    .catch((err) => {
      console.error("ERROR EN API INTERPRETATION:", err);
      setInterpretation(
        "No se pudo generar la interpretación en este momento.",
      );
    })
    .finally(() => setLoadingInterpretation(false));
}, []);

  if (!state) {
    return <p>No hay cartas seleccionadas</p>;
  }

  const cards = [
    { ...past, stage: "Pasado" },
    { ...present, stage: "Presente" },
    { ...future, stage: "Futuro" },
  ];

  const showActions =
    !isMobile || (isMobile && currentIndex === cards.length - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handleSave = async () => {
    if (!readingName.trim()) {
      toast.error("Debes introducir un nombre para la partida");
      return;
    }

    const dataReading = {
      userId: user?.id,
      date: savedDate,
      name: readingName,
      pastCardId: past.id,
      presentCardId: present.id,
      futureCardId: future.id,
      deckType,
      question,
      interpretation,
    };

    try {
      await dbReadings.createReading(dataReading);
      setIsModalOpen(false);
      setReadingName("");
      toast.success("Lectura guardada correctamente");
      navigate("/history");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la lectura");
    }
  };

  return (
    <>
      <div className={styles.desktop}>
        <div key="past" className={styles.card_block}>
          <h3 className={styles.card_title}>Pasado</h3>
          <h4 className={styles.card_name}>{past.spanishName.toUpperCase()}</h4>
          <img
            src={past.sakuraCard}
            alt={past.spanishName}
            className={styles.card_image}
          />
          <div className={styles.box_meaning}>
            <p className={styles.description}>{past.meaning}</p>
          </div>
        </div>

        <div key="present" className={styles.card_block}>
          <h3 className={styles.card_title}>Presente</h3>
          <h4 className={styles.card_name}>
            {present.spanishName.toUpperCase()}
          </h4>

          <img
            src={present.sakuraCard}
            alt={present.spanishName}
            className={styles.card_image}
          />
          <div className={styles.box_meaning}>
            <p className={styles.description}>{present.meaning}</p>
          </div>
        </div>

        <div key="future" className={styles.card_block}>
          <h3 className={styles.card_title}>Futuro</h3>
          <h4 className={styles.card_name}>
            {future.spanishName.toUpperCase()}
          </h4>

          <img
            src={future.sakuraCard}
            alt={future.spanishName}
            className={styles.card_image}
          />
          <div className={styles.box_meaning}>
            <p className={styles.description}>{future.meaning}</p>
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        {cards.length > 0 && (
          <>
            <h3 className={styles.card_title}>{cards[currentIndex].stage}</h3>

            <div className={styles.mobile_card}>
              {currentIndex !== 0 && (
                <button className={styles.arrow_left} onClick={handlePrev}>
                  <img src={ArrowLeft} alt="Izquierda" />
                </button>
              )}
              <h4 className={styles.card_name}>
                {cards[currentIndex].spanishName?.toUpperCase()}
              </h4>
              <img
                src={cards[currentIndex].sakuraCard}
                alt={cards[currentIndex].spanishName}
                className={styles.card_image}
              />

              {currentIndex !== cards.length - 1 && (
                <button className={styles.arrow_right} onClick={handleNext}>
                  <img src={ArrowRight} alt="Derecha" />
                </button>
              )}
            </div>

            <div className={styles.box_meaning}>
              <p className={styles.description}>
                {cards[currentIndex].meaning}
              </p>
            </div>
          </>
        )}
      </div>

      {showActions && (
        <>
          <div className={styles.interpretationTrigger}>
            <button
              className={styles.interpretationBtn}
              onClick={() => setIsInterpretationModalOpen(true)}
              disabled={loadingInterpretation}
            >
              {loadingInterpretation
                ? "Consultando el destino..."
                : "🔮 Ver la respuesta de las cartas"}
            </button>
          </div>

          <div className={styles.actions}>
            <input
              className={styles.subm_btn}
              type="button"
              value="Guardar"
              onClick={() => setIsModalOpen(true)}
            />

            <Button
              text="Reiniciar"
              BtnClass={styles.reset_btn}
              path="/readings"
            />
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
          <p className={styles.interpretationText}>{interpretation}</p>
        </Modal>
      )}

      {isModalOpen && (
        <Modal
          title="Guardar lectura"
          onClose={() => setIsModalOpen(false)}
          actions={
            <>
              <button onClick={handleSave} className={styles.subm_btn}>
                Confirmar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.reset_btn}
              >
                Cancelar
              </button>
            </>
          }
        >
          <input
            type="text"
            placeholder="Nombre de la partida"
            value={readingName}
            onChange={(e) => setReadingName(e.target.value)}
          />
        </Modal>
      )}
    </>
  );
};

export default TarotDeck;
