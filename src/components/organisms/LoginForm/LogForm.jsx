import styles from "./log-form.module.css";
import Button from "../../atoms/Button/Button";
import { Link } from "react-router";
import apiAccount from "../../../services/apiAccount";
import { useState } from "react";
import { useNavigate } from "react-router";
import Avatar from "../../../assets/images/profile_image.png";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import PasswordInput from "../../atoms/PasswordInput/PasswordInput";

function LogForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();
  const dbAccount = apiAccount();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.password) {
      toast.error("Completa todos los campos");
      return;
    }
    try {
      const { account, token } = await dbAccount.login(
        form.name,
        form.password,
      );
      const loggedUser = { ...account, avatar: Avatar };
      login(loggedUser, token);
      navigate("/readings");
    } catch (error) {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.error || "Error al conectar con el servidor";
      toast.error(message);
    }
  };

  return (
    <>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <div className={styles.field_form}>
          <label htmlFor="name" className={styles.label_login}>
            Introduce un alias:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            accessKey="n"
            tabIndex={1}
            className={styles.input_login}
            onChange={handleChange}
            placeholder="Alias"
          />
        </div>

        <div className={styles.field_form}>
          <label htmlFor="password" className={styles.label_login}>
            Introduce una contraseña:
          </label>
          <PasswordInput
            id="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className={styles.input_login}
          />
        </div>

        <div className={styles.fieldbtn_form}>
          <div className={styles.mainRow}>
            <Button BtnClass="subm_btn" text="Confirmar" path="" />
            <Link to="/register" className={styles.register}>
              Regístrate
            </Link>
          </div>
          <Link to="/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </>
  );
}
export default LogForm;
