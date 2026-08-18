import styles from "./reg-form.module.css";
import Button from "../../atoms/Button/Button";
import apiAccount from "../../../services/apiAccount";
import { useState } from "react";
import { useNavigate } from "react-router";
import useToast from "../../../hooks/useToast";
import Modal from "../../molecules/Modal/Modal";
import AvatarGallery from "../../molecules/AvatarGallery/AvatarGallery";
import { AVATARS } from "../../../constants/avatars";
import PasswordInput from "../../atoms/PasswordInput/PasswordInput";

function RegForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatarKey: "default",
  });
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCancel = () => {
    navigate(-1);
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

    setIsLoading(true);

    try {
      const res = await dbAccount.addAccount(form);
      toast.success("¡Cuenta creada correctamente!");
      navigate("/info", { state: res });
    } catch (error) {
      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            error.response?.data?.error ||
            "Error al registrar la cuenta";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            placeholder="Alias"
            disabled={isLoading}
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
            placeholder="tucorreo@mail.com"
            disabled={isLoading}
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
          <PasswordInput
            id="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className={styles.input_login}
            disabled={isLoading}
          />
          <span
            id="passError"
            className={`error ${formErrors.password ? styles.visible : ""}`}
          >
            {formErrors.password || "\u00A0"}
          </span>
        </div>

        <div className={styles.field_form}>
          <label className={styles.label_login}>Tu avatar:</label>
          <button
            type="button"
            className={styles.avatarPreviewBtn}
            onClick={() => setIsAvatarModalOpen(true)}
            disabled={isLoading}
          >
            <img
              src={AVATARS[form.avatarKey]}
              alt="Avatar seleccionado"
              className={styles.avatarPreviewImg}
            />
            <span className={styles.changeText}>Cambiar</span>
          </button>
        </div>

        <div className={styles.fieldbtn_form}>
          <button
            type="button"
            className={styles.cancel_btn}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Volver
          </button>
          <Button
            BtnClass="subm_btn"
            text={isLoading ? "Cargando..." : "Confirmar"}
            disabled={isLoading}
          />
        </div>
      </form>

      {isAvatarModalOpen && (
        <Modal
          title="Elige tu avatar"
          onClose={() => setIsAvatarModalOpen(false)}
          actions={
            <button
              className={styles.subm_btn}
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Listo
            </button>
          }
        >
          <AvatarGallery
            selected={form.avatarKey}
            onSelect={(key) => {
              setForm({ ...form, avatarKey: key });
              setIsAvatarModalOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default RegForm;