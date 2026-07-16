import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./user-menu.module.css";

const UserMenu = ({ user, avatarSrc, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const goTo = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={menuRef}>
            <img src={avatarSrc} alt="" className={styles.avatar} />

            <button
                className={styles.nameTrigger}
                onClick={() => setIsOpen((prev) => !prev)}
                title="Menú de usuario"
            >
                <span className={styles.name}>{user.name}</span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>▾</span>
            </button>

            {isOpen && (
                <ul className={styles.dropdown}>
                    <li>
                        <button onClick={() => goTo("/readings")}>Elegir cartas</button>
                    </li>
                    <li>
                        <button onClick={() => goTo("/history")}>Historial</button>
                    </li>
                    <li className={styles.divider} />
                    <li>
                        <button onClick={handleLogoutClick} className={styles.logoutOption}>
                            Desconectar
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default UserMenu;