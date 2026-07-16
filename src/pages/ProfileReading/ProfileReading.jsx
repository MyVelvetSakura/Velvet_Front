import styles from "./profile-reading.module.css";
import SavedReading from "../../components/organisms/SavedReading/SavedReading";
import { useLocation } from "react-router";


export default function ProfileReading() {
  const { state } = useLocation();

  if (state) {
    return (
      <section className={styles.container}>
        <h2 className={styles.header}>
          Tu lectura {state.name}
        </h2>

        <SavedReading />
      </section>
    );
  } else {
    return <ProfileHome />;
  }
}
