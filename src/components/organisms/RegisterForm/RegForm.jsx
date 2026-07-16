import styles from "./reg-form.module.css";
import Button from "../../atoms/Button/Button";
import apiAccount from "../../../services/apiAccount";
import { useState } from "react";
import { useNavigate } from "react-router";
import useToast from "../../../hooks/useToast";

function RegForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();
  const dbAccount = apiAccount();
  const navigate = useNavigate();
  const patterName = /^\S+$/;
  const patternEmail = /^([A-Za-z0-9_-]+\@[\da-z\.-]+\.[a-z\.]{2,6})$/;
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email || !form.password) {
      toast.error("Se requieren todos los campos");
      return;
    }

    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setFormErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Corrige los errores");
      return;
    }

    try {
      const res = await dbAccount.addAccount(form);
      toast.success("¡Cuenta creada correctamente!");
      navigate("/info", { state: res });
    } catch (error) {
      toast.error(error.response?.data || "Error al registrar la cuenta");
    }
  };

  const validateName = (value) => {
    if (value.trim() === "") return "Campo vacío";
    if (value.trim().length < 2) return "Debe tener mínimo 2 carácteres";
    if (!patterName.test(value)) return "No se aceptan espacios en blanco";
    return "";
  };
  const validateEmail = (value) => {
    if (value.trim() === "") return "Campo vacío";
    if (!patternEmail.test(value)) return "Email no válido";
    return "";
  };
  const validatePassword = (value) => {
    if (value.trim() === "") return "Campo vacío";
    if (value.trim().length < 8) return "Debe tener al menos 8 carácteres";
    if (/\s/.test(value)) return "No puede contener espacios";
    return "";
  };

  return (
    <>
      <form className={styles.reg_form} onSubmit={handleSubmit}>
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
          />
          <span
            id="nameError"
            className={`error ${formErrors.name ? styles.visible : ""}`}
          >
            {formErrors.name || "\u00A0"}
          </span>
        </div>

        <div className={styles.field_form}>
          <label htmlFor="email" className={styles.label_login}>
            Introduce un correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            accessKey="e"
            tabIndex={2}
            className={styles.input_login}
            onChange={handleChange}
          />
          <span
            id="emailError"
            className={`error ${formErrors.email ? styles.visible : ""}`}
          >
            {formErrors.email || "\u00A0"}
          </span>
        </div>

        <div className={styles.field_form}>
          <label htmlFor="password" className={styles.label_login}>
            Introduce una contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            accessKey="p"
            tabIndex={3}
            className={styles.input_login}
            onChange={handleChange}
          />
          <span
            id="passError"
            className={`error ${formErrors.password ? styles.visible : ""}`}
          >
            {formErrors.password || "\u00A0"}
          </span>
        </div>

        <div className={styles.fieldbtn_form}>
          <Button BtnClass="subm_btn" text="Confirmar" path="" />
        </div>
      </form>
    </>
  );
}

export default RegForm;
