import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import apiAccount from "../../services/apiAccount";
import apiProgress from "../../services/apiProgress";
import Modal from "../../components/molecules/Modal/Modal";
import AvatarGallery from "../../components/molecules/AvatarGallery/AvatarGallery";
import ProgressBar from "../../components/molecules/ProgressBar/ProgressBar";
import AchievementsList from "../../components/molecules/AchievementsList/AchievementsList";
import { getAvatarSrc } from "../../constants/avatars";
import CheckButton from "../../components/atoms/checkButton/CheckButton";
import EditButton from "../../components/atoms/EditButton/EditButton";
import styles from "./profile.module.css";
import PasswordInput from "../../components/atoms/PasswordInput/PasswordInput";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const db = apiAccount();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const [nameExists, setNameExists] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletionRequestSent, setDeletionRequestSent] = useState(false);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!user) return;
    const dbProgress = apiProgress();
    dbProgress
      .getProgress(user.id)
      .then(setProgress)
      .catch(() => {});
    dbProgress
      .getAchievements(user.id)
      .then(setAchievements)
      .catch(() => {});
  }, [user]);

  if (!user) {
    return <div className={styles.loading}>Cargando datos de usuario...</div>;
  }

  const handleSaveName = async () => {
    setNameExists(false);
    if (tempName === user.name) {
      setIsEditingName(false);
      return;
    }
    try {
      const updated = await db.editAccount(user.id, tempName);
      setIsEditingName(false);
      updateUser({ name: updated.name });
      toast.success("Nombre actualizado");
    } catch (error) {
      if (error.response?.status === 400) {
        setNameExists(true);
      } else {
        toast.error("No se pudo guardar el cambio.");
      }
    }
  };

  const handleAvatarSelect = async (avatarKey) => {
    try {
      const updated = await db.updateAvatar(user.id, avatarKey);
      updateUser({ avatarKey: updated.avatarKey });
      toast.success("Avatar actualizado");
      setIsAvatarModalOpen(false);
    } catch (error) {
      toast.error("No se pudo actualizar el avatar");
    }
  };

  const handleRequestDeletion = async () => {
    if (!deletePassword) {
      toast.error("Introduce tu contraseña");
      return;
    }
    try {
      await db.requestAccountDeletion(user.id, deletePassword);
      setDeletionRequestSent(true);
      toast.success("Correo de confirmación enviado");
    } catch (error) {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "No se pudo procesar la solicitud";
      toast.error(message);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletePassword("");
    setDeletionRequestSent(false);
  };

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Tu perfil</h3>

      <div className={styles.avatarSection}>
        <img
          src={getAvatarSrc(user.avatarKey)}
          alt="Tu avatar"
          className={styles.currentAvatar}
        />
        <button
          className={styles.changeAvatarBtn}
          onClick={() => setIsAvatarModalOpen(true)}
        >
          Cambiar avatar
        </button>
      </div>

      <div className={styles.nameSection}>
        <span className={styles.label}>Nombre de usuario</span>
        {isEditingName ? (
          <div className={styles.editRow}>
            <input
              className={styles.editInput}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              autoFocus
            />
            <CheckButton onSave={handleSaveName} />
            {nameExists && (
              <span className={styles.errorText}>
                El nombre ya existe. Elige otro
              </span>
            )}
          </div>
        ) : (
          <div className={styles.editRow}>
            <span className={styles.currentName}>{user.name}</span>
            <EditButton onOpenEdit={() => setIsEditingName(true)} />
          </div>
        )}
      </div>

      {progress && (
        <div className={styles.progressSection}>
          <span className={styles.label}>Tu progreso</span>
          <ProgressBar
            level={progress.level}
            experience={progress.experience}
            experienceToNextLevel={progress.experienceToNextLevel}
            credits={progress.credits}
          />
          <p className={styles.readingsCount}>
            Lecturas realizadas: {progress.totalReadings}
          </p>
        </div>
      )}

      {achievements.length > 0 && (
        <div className={styles.achievementsSection}>
          <span className={styles.label}>Tus logros</span>
          <AchievementsList achievements={achievements} />
        </div>
      )}

      <div className={styles.dangerZone}>
        <button
          className={styles.deleteAccountBtn}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Eliminar mi cuenta
        </button>
      </div>

      {isAvatarModalOpen && (
        <Modal
          title="Elige tu avatar"
          onClose={() => setIsAvatarModalOpen(false)}
          actions={
            <button
              className={styles.subm_btn}
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Cerrar
            </button>
          }
        >
          <AvatarGallery
            selected={user.avatarKey}
            onSelect={handleAvatarSelect}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          title={deletionRequestSent ? "Revisa tu correo" : "¿Eliminar tu cuenta?"}
          onClose={closeDeleteModal}
          actions={
            deletionRequestSent ? (
              <button className={styles.subm_btn} onClick={closeDeleteModal}>
                Entendido
              </button>
            ) : (
              <>
                <button
                  className={styles.subm_btn}
                  onClick={handleRequestDeletion}
                >
                  Enviar email de confirmación
                </button>
                <button
                  className={styles.reset_btn}
                  onClick={closeDeleteModal}
                >
                  Cancelar
                </button>
              </>
            )
          }
        >
          {deletionRequestSent ? (
            <p>
              Te hemos enviado un correo a tu email registrado. Haz click en el
              enlace para confirmar la eliminación definitiva de tu cuenta.
            </p>
          ) : (
            <>
              <p>
                Esta acción es <strong>permanente</strong> y borrará todas tus
                lecturas guardadas.
              </p>
              <p>Introduce tu contraseña para confirmar que eres tú:</p>
              <PasswordInput
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Contraseña"
                className={styles.input_login}
              />
            </>
          )}
        </Modal>
      )}
    </main>
  );
};

export default Profile;