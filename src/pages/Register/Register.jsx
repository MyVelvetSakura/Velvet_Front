import RegForm from "../../components/organisms/RegisterForm/RegForm";
import styles from "./register.module.css";

const Register=()=>{

    return(
        <>
        <h3 className={styles.title_register}>Registra tu nueva cuenta</h3>
        <section>
            <RegForm/>
        </section>
        </>
    )
}

export default Register;