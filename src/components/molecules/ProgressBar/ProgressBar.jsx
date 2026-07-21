import styles from "./progress-bar.module.css";

const ProgressBar = ({ level, experience, experienceToNextLevel, credits }) => {
    const totalForBar = experience + experienceToNextLevel;
    const percentage = totalForBar > 0 ? (experience / totalForBar) * 100 : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.levelBadge}>Nivel {level}</span>
                <span className={styles.credits}>🪶 {credits} Plumas de Yue</span>
            </div>
            <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${percentage}%` }} />
                <span className={styles.label}>{experience} / {totalForBar} XP</span>
            </div>
        </div>
    );
};

export default ProgressBar;