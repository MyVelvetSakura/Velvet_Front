import styles from "./edit-button.module.css";
const EditButton= ({onOpenEdit}) => {
    return(
       <>
       <button className={styles.penIcon} onClick={onOpenEdit}></button>
       </>
        
    )
}
export default EditButton;