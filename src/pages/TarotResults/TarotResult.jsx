import styles from "./tarot-results.module.css";
import TarotDeck from "../../components/organisms/TarotDeck/TarotDeck";
import useAuth from "../../hooks/useAuth";

export default function TarotResult() {
  const { user } = useAuth();

  return(
     <section className={styles.container}>
    <h2 className={styles.header}>El sino es revelado</h2>
    <TarotDeck user={user}/>

    </section>
  )
}

