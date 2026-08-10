import styles from "./check-button.module.css";

const CheckButton = ({ onSave }) => {
    return (
        <button
            className={styles.checkIcon}
            onClick={onSave}
            aria-label="Guardar cambio"
        />
    );
};

export default CheckButton;