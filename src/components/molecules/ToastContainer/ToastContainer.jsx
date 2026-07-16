import Toast from "../../atoms/Toast/Toast";
import styles from "./toast-container.module.css";

const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;