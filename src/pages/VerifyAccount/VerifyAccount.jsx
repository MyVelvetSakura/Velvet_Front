import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import apiAccount from "../../services/apiAccount";
import useToast from "../../hooks/useToast";
import styles from "./verify-account.module.css";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("pendiente");

  const token = searchParams.get("token");

  const handleVerify = () => {
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("verificando");
    const db = apiAccount();
    db.verifyAccount(token)
      .then(() => {
        setStatus("ok");
        toast.success("Cuenta verificada correctamente");
        setTimeout(() => navigate("/home", { replace: true }), 2000);
      })
      .catch((error) => {
        setStatus("error");
        toast.error(error.response?.data || "No se pudo verificar la cuenta");
      });
  };

  return (
    <div className={styles.container}>
      {status === "pendiente" && (
        <>
          <p className={styles.message}>Pulsa el botón para activar tu cuenta.</p>
          <button className={styles.subm_btn} onClick={handleVerify}>
            Verificar mi cuenta
          </button>
        </>
      )}
      {status === "verificando" && (
        <>
          <div className={styles.spinner} />
          <p className={styles.message}>Verificando tu cuenta...</p>
        </>
      )}
      {status === "ok" && <p className={styles.message}>¡Cuenta verificada! Redirigiendo...</p>}
      {status === "error" && (
        <>
          <p className={styles.message}>El enlace no es válido o ha caducado.</p>
          <p className={styles.hint}>
            Si ya intentaste verificar antes, es posible que tu cuenta ya esté activa —
            prueba a iniciar sesión directamente.
          </p>
        </>
      )}
    </div>
  );
};

export default VerifyAccount;