import { useLocation } from "react-router";
import BoardCards from '../../components/organisms/BoardCards/BoardCards';
import DeckSelect from '../../components/organisms/DeckSelect/DeckSelect';
import styles from "./start.module.css";

const Start = () => {
    const { state } = useLocation();
    const deckType = state?.deckType;
    const question = state?.question;

    if (!deckType) {
        return <DeckSelect />;
    }

    return (
        <div className={styles.start_overflow}>
            <h2 className={styles.title_start}>Elige 3 cartas para el orden de pasado, presente y futuro</h2>
            <BoardCards deckType={deckType} question={question} />
        </div>
    );
}

export default Start;