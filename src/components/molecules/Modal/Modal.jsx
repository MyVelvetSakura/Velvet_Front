import { useEffect } from "react";
import styles from "./modal.module.css";

const Modal = ({ title, children, onClose, actions, background }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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