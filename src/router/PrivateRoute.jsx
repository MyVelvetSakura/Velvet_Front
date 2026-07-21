import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import { isTokenExpired } from "../utils/jwt";

const PrivateRoute = () => {
    const { user, logout } = useAuth();
    const token = localStorage.getItem("token");

    if (!user || !token || isTokenExpired(token)) {
        if (user) logout();
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;