import apiReading from "../../../services/apiReading"
import { useState, useEffect } from "react"
import ReadingCard from "../../molecules/ReadingCard/ReadingCard";
import styles from "./history-cards.module.css"
import Button from "../../atoms/Button/Button";
import DropButton from "../../molecules/DropButton/DropButton";
import notFoundImg from "../../../assets/images/notfound.png";

const ITEMS_PER_PAGE = 15;

const HistoryCards = ({userId}) => {
    const [reading,setReading]= useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const triggerRefresh = () => setRefresh(prev => !prev);

    const dbReading = apiReading();

    useEffect(() => {
        dbReading.getByUserId(userId).then(data =>{
            setReading(data)
        })
     }, [userId, refresh]);

    const totalPages = Math.ceil(reading.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedReadings = reading.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteWithPageCheck = () => {
        triggerRefresh();
        if (paginatedReadings.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

return(
    <>
    {reading && reading.length > 0 ?(
        <section>
    <div className= {styles.card}>
    {paginatedReadings.map((item) => (
        <ReadingCard
            key={item.id}
            data={item}
            onDelete={handleDeleteWithPageCheck}
        />
))}
    </div>

    {totalPages > 1 && (
        <div className={styles.pagination}>
            <button
                className={styles.pageArrow}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
                <button
                    key={i}
                    className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ""}`}
                    onClick={() => goToPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className={styles.pageArrow}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ›
            </button>
        </div>
    )}

    <div className={styles.drop_btn}><DropButton userId= {userId} onDelete={triggerRefresh}/></div>
    </section>
    ):(
         <section className= {styles.no_cards}>
            <img className={styles.img_no_cards} src={notFoundImg} alt="no hay resultados"/>
            <p> No hay lecturas guardadas. Revela ahora tu destino.</p>
            <Button BtnClass="subm_btn" path="/readings" text= "Inicio" />
         </section>
        
    )}
    </>
    
)
}

export default HistoryCards;