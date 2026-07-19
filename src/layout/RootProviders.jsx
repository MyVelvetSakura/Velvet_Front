import { Outlet } from "react-router";
import { AuthProvider } from "../context/auth/AuthProvider";
import { ThemeProvider } from "../context/theme/ThemeProvider";
import { ToastProvider } from "../context/toast/ToastProvider";
import ThemeDecoration from "../components/atoms/ThemeDecoration/ThemeDecoration";

const RootProviders = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <ThemeDecoration />
                    <Outlet />
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default RootProviders;