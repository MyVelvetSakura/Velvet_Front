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
            <h3 className={styles.title_data}>¡Bienvenid@ {name} a Velvet Sakura!</h3>
            <p>En breves momentos recibirás un correo con los datos de cuenta y un enlace para 
                validar tu cuenta.</p>
        </div>
        <div className={styles.field_btnResults}>
        <Button BtnClass="subm_btn" text="Inicio" path="/"/>
        </div>
        </>
    )
}

export default DataForm;