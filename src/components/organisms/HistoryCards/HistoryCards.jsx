import apiReading from "../../../services/apiReading"
import { useState, useEffect } from "react"
import ReadingCard from "../../molecules/ReadingCard/ReadingCard";
import styles from "./history-cards.module.css"
import Button from "../../atoms/Button/Button";
import DropButton from "../../molecules/DropButton/DropButton";
import useToast from "../../../hooks/useToast";

const HistoryCards = ({userId}) => {
   const { toast } = useToast();
    const [reading,setReading]= useState([]);
    const [refresh, setRefresh] = useState(false);
    const triggerRefresh = () => setRefresh(prev => !prev);
    
    const dbReading = apiReading();

    const handleSave = async() => {
      setNameExists(false);
      if (tempName === user.name) { setIsEditing(false); return; }
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
 useEffect(() => {
    dbReading.getByUserId(userId).then(data =>{
        setReading(data)
    })
 }, [userId, refresh]);

return(
    <>
    {reading && reading.length > 0 ?(
        <section>
    <div className= {styles.card}>
    {reading.map((item) => (
        <ReadingCard 
            key={item.id} 
            data={item} 
            onDelete= {triggerRefresh}
            
        />
))}
    </div>
    <div className={styles.drop_btn}><DropButton userId= {userId} onDelete={triggerRefresh}/></div>
    </section>
    ):(
         <section className= {styles.no_cards}>
            <img className={styles.img_no_cards} src="/src/assets/images/Momo.jpg" alt="Relax"/>
            <p> No hay lecturas guardadas. Revela ahora tu destino.</p>
            <Button BtnClass="subm_btn" path="/readings" text= "Inicio" />
         </section>
        
    )}
    </>
    
)
}

export default HistoryCards;