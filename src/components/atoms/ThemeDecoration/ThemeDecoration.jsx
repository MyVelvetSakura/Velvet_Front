import useTheme from "../../../hooks/useTheme";
import styles from "./theme-decoration.module.css";

const ThemeDecoration = () => {
  const { theme } = useTheme();

  if (theme === "clow") {
    return (
      <div className={styles.clowLayer}>
        <div className={styles.astralCircle} />
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.sakuraLayer}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className={styles.petal}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ThemeDecoration;