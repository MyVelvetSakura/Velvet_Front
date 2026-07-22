import { Outlet } from "react-router";
import { AuthProvider } from "../context/auth/AuthProvider";
import { ThemeProvider } from "../context/theme/ThemeProvider";
import { ToastProvider } from "../context/toast/ToastProvider";
import ThemeDecoration from "../components/atoms/ThemeDecoration/ThemeDecoration";
import { AudioProvider } from "../context/audio/AudioProvider";


const RootProviders = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                     <AudioProvider>
                    <ThemeDecoration />
                    <Outlet />
                    </AudioProvider>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default RootProviders;