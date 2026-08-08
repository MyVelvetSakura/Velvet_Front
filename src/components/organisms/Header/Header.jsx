import { useState, useEffect } from "react";
import Logo from "../../../assets/images/Logo.png";
import styles from "./header.module.css";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import UserMenu from "../../molecules/UserMenu/UserMenu";
import useTheme from "../../../hooks/useTheme";
import { getAvatarSrc } from "../../../constants/avatars";

const Header = () => {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleTitleClick = () => {
    if (user) {
      navigate("/readings");
    } else {
      navigate("/home");
    }
  };

  const handleLogout = () => {
    logout();
    setTheme("sakura");
    navigate("/home");
  };

  return (
    <header className={styles.header}>
      <img
        src={Logo}
        alt="Logo Velvet Sakura"
        className={styles.logo_header}
        onClick={handleTitleClick}
        title="Inicio"
      />
      <div className={styles.titles}>
        <h1 className={styles.main_title}>Velvet Sakura</h1>
        <h2 className={styles.subtitle_header}>
          {user ? (
            <span
              className={styles.welcomeText}
            >{`Bienvenid@, ${user.name}`}</span>
          ) : (
            "Cartas del destino"
          )}
        </h2>
      </div>

      {user && (
        <div className={styles.field_profile}>
          <UserMenu
            user={user}
            avatarSrc={getAvatarSrc(user.avatarKey)}
            onLogout={handleLogout}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
