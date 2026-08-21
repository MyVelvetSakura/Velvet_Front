import EditButton from "../../atoms/EditButton/EditButton.jsx";
import styles from "./reading-card.module.css";
import { useState } from "react";
import apiReading from "../../../services/apiReading.jsx";
import { useNavigate } from "react-router";
import CheckButton from "../../atoms/CheckButton/CheckButton.jsx";
import DeleteButton from "../DeleteButton/DeleteButton.jsx";
import historialImg from "../../../assets/images/historial.png";

const ReadingCard = ({data, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(data.name);
    
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleButtonClick = () => {
        navigate("/profile",{
            state: {
                past: data.pastCardId,
                present: data.presentCardId,
                future: data.futureCardId,
                name: data.name,
                id: data.id
            }
        });
    }

    const db = apiReading();

    const handleSave = () => {
        db.editName(data.id, tempName).then(() => {
            setIsEditing(false);
        })
        .catch((err) => {
            console.error("Error al actualizar:", err);
            alert("No se pudo guardar el cambio.");
        });
    };

    return( 
       <div className={styles.cardContainer}>
            <div className={styles.iconWrapper} onClick={handleButtonClick} title="Cartas guardadas">
                <img src={historialImg} alt="icono Historial" className={styles.img_card} />
            </div>

            <p className={styles.dateText}>{formatDate(data.date)}</p>

            <div className={styles.nameRow}>
                {isEditing ? (
                <>
                    <input 
                        className={styles.editInput}
                        value={tempName} 
                        onChange={(event) => setTempName(event.target.value)} 
                        autoFocus
                    />
                    <CheckButton onSave={handleSave} />    
                </>
            ) : (
                <>
                <EditButton onOpenEdit={() => setIsEditing(true)}/> 
                <span>{tempName}</span>
                </>)}
            </div>
            <DeleteButton id={data.id} onDelete={onDelete} /> 
       </div>
    );
};

export default ReadingCard;