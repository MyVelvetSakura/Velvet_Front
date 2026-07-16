import Button from "../../atoms/Button/Button";
import { useLocation } from "react-router";
import styles from "./data-form.module.css";
import Avatar from "../../../assets/images/profile_image.png";

const DataForm=()=>{
const location = useLocation();
    const { name, email, password } = location.state || {};
    return(
        <>
        <div className={styles.data_card}>
            <img src={Avatar} alt={name} title={name} className={styles.avatar}/>
            <h3 className={styles.title_data}>¡Bienvenida {name} a Velvet Sakura!</h3>
            <p>Estos son tus datos. Guardalos para poder acceder a tu cuenta:</p>
            <ul>
                <li><strong>Usuario: </strong> {name}</li>
                <li><strong>Email: </strong> {email}</li>
                <li><strong>Contraseña: </strong> {password}</li>
            </ul>
        </div>
        <div className={styles.field_btnResults}>
        <Button BtnClass="subm_btn" text="Inicio" path="/"/>
        </div>
        </>
    )
}

export default DataForm;