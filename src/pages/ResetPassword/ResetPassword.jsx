import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import apiAccount from "../../services/apiAccount";
import useToast from "../../hooks/useToast";
import styles from "./reset-password.module.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Enlace no válido");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const db = apiAccount();
      await db.resetPassword(token, password);
      toast.success("Contraseña actualizada. Ya puedes iniciar sesión");
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error(error.response?.data || "No se pudo actualizar la contraseña");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Crear nueva contraseña</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="password" className={styles.label}>Nueva contraseña:</label>
        <input
          type="password"
          id="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword" className={styles.label}>Confirma la contraseña:</label>
        <input
          type="password"
          id="confirmPassword"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className={styles.subm_btn}>Actualizar contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;