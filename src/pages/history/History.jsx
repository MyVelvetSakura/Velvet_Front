import useAuth from "../../hooks/useAuth";
import HistoryCards from "../../components/organisms/historyCards/HistoryCards";
import styles from "./history.module.css";

const History = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className={styles.loading}>Cargando datos de usuario...</div>;
    }

    return (
        <main>
            <header className={styles.header_section}>
                <div>
                    <h3>Bienvenid@, {user.name}, a tu historial de lecturas</h3>
                    <p>Para eliminar una lectura haz click en Eliminar</p>
                    <p>Para borrar el historial haz click en Borrar</p>
                </div>
            </header>
            <section className={styles.section_cards}>
                <HistoryCards userId={user.id} />
            </section>
        </main>
    )
}

export default History;