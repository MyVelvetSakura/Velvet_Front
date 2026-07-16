import styles from "./toast.module.css";

const Toast = ({ message, type, onDismiss }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`} onClick={onDismiss}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;