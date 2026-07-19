import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useToast from "../../hooks/useToast";
import styles from "./ask-question.module.css";

const AskQuestion = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [question, setQuestion] = useState("");

    const deckType = state?.deckType;

    if (!deckType) {
        navigate("/readings", { replace: true });
        return null;
    }

    const handleContinue = () => {
        if (!question.trim()) {
            toast.error("Escribe tu pregunta antes de continuar");
            return;
        }
        navigate("/readings/board", { state: { deckType, question: question.trim() } });
    };

    const handleSkip = () => {
        navigate("/readings/board", { state: { deckType, question: "" } });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>¿Qué quieres preguntarle a las cartas?</h2>
            <p className={styles.subtitle}>
                Formula tu pregunta con el corazón abierto. Las cartas responderán a lo que realmente necesitas saber.
            </p>
            <textarea
                className={styles.textarea}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Qué camino debo seguir en mi vida amorosa?"
                rows={4}
            />
            <div className={styles.actions}>
                <button className={styles.subm_btn} onClick={handleContinue}>Continuar</button>
                <button className={styles.reset_btn} onClick={handleSkip}>Prefiero no preguntar</button>
            </div>
        </div>
    );
};

export default AskQuestion;