import styles from "./achievements-list.module.css";

const AchievementsList = ({ achievements }) => {
    return (
        <div className={styles.grid}>
            {achievements.map((a) => (
                <div key={a.code} className={`${styles.card} ${a.unlocked ? styles.unlocked : styles.locked}`}>
                    <div className={styles.icon}>{a.unlocked ? "🏆" : "🔒"}</div>
                    <h4 className={styles.title}>{a.title}</h4>
                    <p className={styles.description}>{a.description}</p>
                    {a.unlocked && <span className={styles.reward}>+{a.creditsReward} 🪶</span>}
                </div>
            ))}
        </div>
    );
};

export default AchievementsList;