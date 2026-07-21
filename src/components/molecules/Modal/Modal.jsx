import styles from "./modal.module.css";

const Modal = ({ title, children, onClose, actions, background }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {background}
        <div className={styles.contentWrapper}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <div className={styles.content}>{children}</div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;