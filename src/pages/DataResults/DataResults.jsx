import styles from "./data-results.module.css";
import DataForm from "../../components/organisms/DataForm/DataForm";


const DataResults=()=>{
    
    return(
        <>
        <h3 className={styles.data_title}>¡Te has registrado correctamente!</h3>
        <section>
            <DataForm/>
        </section>
        </>
    )
}

export default DataResults;