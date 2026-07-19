import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import apiAccount from "../../services/apiAccount";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import styles from "./confirm-delete-account.module.css";

const ConfirmDeleteAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState("pendiente");

  const token = searchParams.get("token");

  const handleConfirm = () => {
    if (!token) {
      setStatus("error");
      return;
    }
    setStatus("procesando");
    const db = apiAccount();
    db.confirmAccountDeletion(token)
      .then(() => {
        setStatus("ok");
        logout();
        toast.success("Tu cuenta ha sido eliminada");
        setTimeout(() => navigate("/home", { replace: true }), 2500);
      })
      .catch((error) => {
        setStatus("error");
        const message = typeof error.response?.data === "string"
            ? error.response.data
            : "No se pudo eliminar la cuenta";
        toast.error(message);
      });
  };

  return (
    <div className={styles.container}>
      {status === "pendiente" && (
        <>
          <p className={styles.message}>
            Esta es tu última oportunidad para cancelar. Al confirmar, tu cuenta y todas tus lecturas se eliminarán permanentemente.
          </p>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Sí, eliminar mi cuenta definitivamente
          </button>
        </>
      )}
      {status === "procesando" && <p className={styles.message}>Eliminando tu cuenta...</p>}
      {status === "ok" && <p className={styles.message}>Tu cuenta ha sido eliminada. Gracias por haber usado Velvet Sakura.</p>}
      {status === "error" && <p className={styles.message}>El enlace no es válido o ha caducado.</p>}
    </div>
  );
};

export default ConfirmDeleteAccount;