import "./Advertisement.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import Modal from "../../modal/Modal.jsx";
import Login from "../accounts/Login.jsx";

export default function LoginModal() {
  const userProgressStore = useContext(UserProgressContext);

  return (
    <Modal
      id="login-modal"
      open={userProgressStore.modalProgress === "login"}
      onClose={
        userProgressStore.modalProgress === "login"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <Login />
    </Modal>
  );
}
