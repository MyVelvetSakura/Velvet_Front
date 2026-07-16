import { useState } from "react";
import styles from "./delete-button.module.css";
import apiReading from "../../../services/apiReading";
import Modal from "../Modal/Modal";
import useToast from "../../../hooks/useToast";

const DeleteButton = ({ id, onDelete }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const db = apiReading();
    const { toast } = useToast();

    const handleDelete = () => {
        db.deleteReading(id)
            .then(() => {
                setIsConfirmOpen(false);
                toast.success("Lectura eliminada");
                if (onDelete) onDelete();
            })
            .catch((err) => {
                console.error("Error al borrar:", err);
                toast.error("No se pudo eliminar la lectura");
            });
    };

    return(
        <>
            <button className={styles.subm_btn} onClick={() => setIsConfirmOpen(true)}>Eliminar</button>

            {isConfirmOpen && (
                <Modal
                    title="¿Eliminar esta lectura?"
                    onClose={() => setIsConfirmOpen(false)}
                    actions={
                        <>
                            <button className={styles.subm_btn} onClick={handleDelete}>Confirmar</button>
                            <button className={styles.reset_btn} onClick={() => setIsConfirmOpen(false)}>Cancelar</button>
                        </>
                    }
                >
                    <p>Esta acción no se puede deshacer.</p>
                </Modal>
            )}
        </>
    )
}
export default DeleteButton;