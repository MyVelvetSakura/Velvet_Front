import LogForm from "../../components/organisms/LoginForm/LogForm"
import styles from "./home.module.css";


const Home = () => {
    return (
        <>
            <h3 className={styles.title_login}>Inicia sesión o regístrate como nuevo usuario</h3>
            <section>
                <LogForm/>
            </section>
        </>
    )
}

export default Home