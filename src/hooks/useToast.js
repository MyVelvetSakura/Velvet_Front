import { useContext } from "react";
import { ToastContext } from "../context/toast/ToastContext";

const useToast = () => useContext(ToastContext);

export default useToast;