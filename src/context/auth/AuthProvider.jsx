import { useState } from "react";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (user, token) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const updateUser = (updatedFields) => {
        setUser((prev) => {
            const newUser = { ...prev, ...updatedFields };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};