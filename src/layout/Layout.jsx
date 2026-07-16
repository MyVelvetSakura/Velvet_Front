import { Outlet } from "react-router";
import Header from "../components/organisms/Header/Header";
import { AuthProvider } from "../context/auth/AuthProvider";
import { ThemeProvider } from "../context/theme/ThemeProvider";
import { ToastProvider } from "../context/toast/ToastProvider";
import ThemeDecoration from "../components/atoms/ThemeDecoration/ThemeDecoration";

const Layout = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <ThemeDecoration />
                    <Header/>
                    <main><Outlet/></main>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default Layout;