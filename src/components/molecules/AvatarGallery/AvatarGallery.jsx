import { AVATARS, AVATAR_OPTIONS } from "../../../constants/avatars";
import styles from "./avatar-gallery.module.css";

const AvatarGallery = ({ selected, onSelect }) => {
  return (
    <div className={styles.gallery}>
      {AVATAR_OPTIONS.map((key) => (
        <button
          key={key}
          type="button"
          className={`${styles.avatarOption} ${selected === key ? styles.selected : ""}`}
          onClick={() => onSelect(key)}
        >
          <img src={AVATARS[key]} alt={key} className={styles.avatarImg} />
        </button>
      ))}
    </div>
  );
};

export default AvatarGallery;