import { useState } from "react";
import apiAccount from "../../services/apiAccount";
import useToast from "../../hooks/useToast";
import styles from "./forgot-password.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Introduce tu email");
      return;
    }
    try {
      const db = apiAccount();
      await db.forgotPassword(email);
      setSent(true);
      toast.success("Si el email existe, te hemos enviado un enlace");
    } catch (error) {
      toast.error(error.response?.data || "No se pudo procesar la solicitud");
    }
  };

  return (
    <div className={styles.container}>
      <h3>Recuperar contraseña</h3>
      {sent ? (
        <p>Revisa tu correo para continuar con la recuperación.</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Introduce tu email registrado:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.subm_btn}>Enviar enlace</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;