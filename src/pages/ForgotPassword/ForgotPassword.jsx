import { useState } from "react";
import { Link } from "react-router";
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
      <h3 className={styles.title}>Recuperar contraseña</h3>
      {sent ? (
        <p className={styles.confirmationText}>
          Revisa tu correo para continuar con la recuperación.
        </p>
      ) : (
        <>
          <p className={styles.subtitle}>
            Introduce el email con el que te registraste y te enviaremos un enlace para crear una nueva contraseña.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.subm_btn}>Enviar enlace</button>
          </form>
        </>
      )}
      <Link to="/home" className={styles.backLink}>Volver al inicio</Link>
    </div>
  );
};

export default ForgotPassword;