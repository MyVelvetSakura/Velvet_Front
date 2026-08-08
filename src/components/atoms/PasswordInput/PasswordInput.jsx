import { useState } from "react";
import styles from "./password-input.module.css";

const PasswordInput = ({ value, onChange, id, name, placeholder, className }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.wrapper}>
            <input
                type={visible ? "text" : "password"}
                id={id}
                name={name || id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${styles.input} ${className || ""}`}
            />
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setVisible((v) => !v)}
                tabIndex={-1}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {visible ? "🙈" : "👁️"}
            </button>
        </div>
    );
};

export default PasswordInput;