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
    {Array.from({ length: 35 }).map((_, i) => {
      const size = 20 + Math.random() * 20;
      return (
        <span
          key={i}
          className={styles.petal}
          style={{
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      );
    })}
  </div>
);
};

export default ThemeDecoration;