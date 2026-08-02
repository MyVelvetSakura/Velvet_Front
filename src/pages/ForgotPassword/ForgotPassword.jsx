import { useState } from "react";
import { Link, useNavigate } from "react-router";
import apiAccount from "../../services/apiAccount";
import useToast from "../../hooks/useToast";
import styles from "./forgot-password.module.css";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRequestCode = async (event) => {
        event.preventDefault();
        if (!email.trim()) {
            toast.error("Introduce tu email");
            return;
        }
        try {
            const db = apiAccount();
            await db.forgotPassword(email);
            toast.success("Te hemos enviado un código a tu correo");
            setStep("code");
        } catch (error) {
            toast.error("No se pudo procesar la solicitud");
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (!code.trim()) {
            toast.error("Introduce el código que recibiste por email");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        try {
            const db = apiAccount();
            await db.resetPassword(email, code, newPassword);
            toast.success("Contraseña actualizada. Ya puedes iniciar sesión");
            navigate("/home");
        } catch (error) {
            const message = typeof error.response?.data === "string"
                ? error.response.data
                : "Código incorrecto o caducado";
            toast.error(message);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Recuperar contraseña</h3>

            {step === "email" ? (
                <>
                    <p className={styles.subtitle}>
                        Introduce el email con el que te registraste y te enviaremos un código para crear una nueva contraseña.
                    </p>
                    <form onSubmit={handleRequestCode} className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className={styles.subm_btn}>Enviar código</button>
                    </form>
                </>
            ) : (
                <>
                    <p className={styles.subtitle}>
                        Introduce el código de 6 dígitos que te hemos enviado a <strong>{email}</strong>. Caduca en 5 minutos.
                    </p>
                    <form onSubmit={handleResetPassword} className={styles.form}>
                        <label htmlFor="code" className={styles.label}>Código:</label>
                        <input
                            type="text"
                            id="code"
                            maxLength={6}
                            className={styles.input}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                        <label htmlFor="newPassword" className={styles.label}>Nueva contraseña:</label>
                        <input
                            type="password"
                            id="newPassword"
                            className={styles.input}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                </>
            )}

            <Link to="/home" className={styles.backLink}>Volver al inicio</Link>
        </div>
    );
};

export default ForgotPassword;