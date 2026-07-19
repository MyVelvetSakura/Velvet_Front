import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import apiAccount from "../../services/apiAccount";
import Modal from "../../components/molecules/Modal/Modal";
import AvatarGallery from "../../components/molecules/AvatarGallery/AvatarGallery";
import { getAvatarSrc } from "../../constants/avatars";
import CheckButton from "../../components/atoms/checkButton/CheckButton";
import EditButton from "../../components/atoms/EditButton/EditButton";
import styles from "./profile.module.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const db = apiAccount();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const [nameExists, setNameExists] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

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
    const updated = await db.updateAvatar(user.id, avatarKey);
    updateUser({ avatarKey: updated.avatarKey });
    toast.success("Avatar actualizado");
    setIsAvatarModalOpen(false);
  };

  const handleRequestDeletion = async () => {
    if (!deletePassword) {
      toast.error("Introduce tu contraseña");
      return;
    }
    try {
      await db.requestAccountDeletion(user.id, deletePassword);
      toast.success("Revisa tu correo para confirmar la eliminación");
      setIsDeleteModalOpen(false);
      setDeletePassword("");
    } catch (error) {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "No se pudo procesar la solicitud";
      toast.error(message);
    }
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

      <div className={styles.dangerZone}>
        <button
          className={styles.deleteAccountBtn}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Eliminar mi cuenta
        </button>
      </div>

      {isDeleteModalOpen && (
        <Modal
          title="¿Eliminar tu cuenta?"
          onClose={() => setIsDeleteModalOpen(false)}
          actions={
            <>
              <button
                className={styles.subm_btn}
                onClick={handleRequestDeletion}
              >
                Enviar email de confirmación
              </button>
              <button
                className={styles.reset_btn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
            </>
          }
        >
          <p>
            Esta acción es <strong>permanente</strong> y borrará todas tus
            lecturas guardadas.
          </p>
          <p>Introduce tu contraseña para confirmar que eres tú:</p>
          <input
            type="password"
            className={styles.editInput}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
        </Modal>
      )}
    </main>
  );
};

export default Profile;
