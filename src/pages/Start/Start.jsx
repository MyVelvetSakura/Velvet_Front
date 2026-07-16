import { useState } from "react";
import BoardCards from '../../components/organisms/BoardCards/BoardCards';
import DeckSelect from '../../components/organisms/DeckSelect/DeckSelect';
import styles from "./start.module.css";

const Start = () => {
    const [deckType, setDeckType] = useState(null);

    if (!deckType) {
        return <DeckSelect onSelect={setDeckType} />;
    }

    return (
        <>
            <div className={styles.start_overflow}>
                <h2 className={styles.title_start}>Elige 3 cartas para el orden de pasado, presente y futuro</h2>
                <BoardCards deckType={deckType} />
            </div>
        </>
    );
}

export default Start;