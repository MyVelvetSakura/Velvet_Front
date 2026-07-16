import { useState } from "react";
import styles from "./history.module.css";
import apiAccount from "../../services/apiAccount";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import CheckButton from "../../components/atoms/checkButton/CheckButton";
import EditButton from "../../components/atoms/EditButton/EditButton";
import HistoryCards from "../../components/organisms/historyCards/HistoryCards";

const History = () => {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(user?.name || "invitada");
    const [nameExists, setNameExists] = useState(false);

    const db = apiAccount();

    const handleSave = async () => {
        setNameExists(false);
        if (tempName === user.name) {
            setIsEditing(false);
            return;
        }
        try {
            const updated = await db.editAccount(user.id, tempName);
            setIsEditing(false);
            login({ ...user, name: updated.name });
            toast.success("Nombre actualizado");
        } catch (error) {
            if (error.response?.status === 400) {
                setNameExists(true);
            } else {
                toast.error("No se pudo guardar el cambio.");
            }
        }
    };

    if (!user) {
        return <div className={styles.loading}>Cargando datos de usuario...</div>;
    }

    return (
        <>
            <main>
                <header className={styles.header_section}>
                    <div>
                        <h3>Bienvenid@, {tempName}, a tu historial de lecturas</h3>
                        <p>Para eliminar una lectura haz click en Eliminar</p>
                        <p>Para borrar el historial haz click en Borrar</p>
                    </div>
                    <div className={styles.edit_user}>
                        {isEditing ? (
                            <>
                                <input
                                    className={styles.editInput}
                                    value={tempName}
                                    onChange={(event) => setTempName(event.target.value)}
                                    autoFocus
                                />
                                <CheckButton onSave={handleSave} />
                                {nameExists && (<span>El nombre ya existe. Elige otro</span>)}
                            </>
                        ) : (
                            <>
                                <EditButton onOpenEdit={() => setIsEditing(true)} />
                                <span>Editar nombre usuario</span>
                            </>
                        )}
                    </div>
                </header>
                <section>
                    <HistoryCards userId={user.id} />
                </section>
            </main>
        </>
    )
}

export default History;