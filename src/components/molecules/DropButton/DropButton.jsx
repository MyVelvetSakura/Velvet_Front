import { useState } from "react";
import styles from "./drop-button.module.css";
import apiReading from "../../../services/apiReading";
import Modal from "../Modal/Modal";
import useToast from "../../../hooks/useToast";

const DropButton = ({ userId, onDelete }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const db = apiReading();
    const { toast } = useToast();

    const handleDrop = async () => {
        try {
            await db.deleteAllByUserId(userId);
            setIsConfirmOpen(false);
            toast.success("Historial borrado");
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Error al borrar el historial:", error);
            toast.error("No se pudo borrar el historial");
        }
    };

    return(
        <>
        <button className={styles.subm_btn} onClick={() => setIsConfirmOpen(true)}>Borrar historial</button>

        {isConfirmOpen && (
            <Modal
                title="¿Borrar todo el historial?"
                onClose={() => setIsConfirmOpen(false)}
                actions={
                    <>
                        <button className={styles.subm_btn} onClick={handleDrop}>Confirmar</button>
                        <button className={styles.reset_btn} onClick={() => setIsConfirmOpen(false)}>Cancelar</button>
                    </>
                }
            >
                <p>Se eliminarán todas tus lecturas guardadas. Esta acción no se puede deshacer.</p>
            </Modal>
        )}
        </>
    )
}
export default DropButton;