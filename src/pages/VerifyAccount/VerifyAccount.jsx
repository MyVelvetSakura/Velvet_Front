import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import apiAccount from "../../services/apiAccount";
import useToast from "../../hooks/useToast";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("verificando");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

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
  }, [searchParams, navigate, toast]);

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      {status === "verificando" && <h3>Verificando tu cuenta...</h3>}
      {status === "ok" && <h3>¡Cuenta verificada! Redirigiendo...</h3>}
      {status === "error" && <h3>El enlace no es válido o ha caducado.</h3>}
    </div>
  );
};

export default VerifyAccount;