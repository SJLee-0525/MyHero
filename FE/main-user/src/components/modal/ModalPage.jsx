import { useContext } from "react";
import { StoreContext } from "../../store/store.jsx";

import Modal from "./Modal.jsx";
import Emergency from "../emergency/Emergency.jsx";
import EmergencyModal from "./EmergencyModal.jsx";
import MessageModal from "./MessageModal.jsx";
import NoticeModal from "./NoticeModal.jsx";
import HealthModal from "./HealthModal.jsx";
import ModalSettingBox from "./ModalSettingBox.jsx";
import SettingModal from "./SettingModal.jsx";

export default function ModalPage() {
  const store = useContext(StoreContext);

  return (
    <>
      <Modal open={store.openMessageState} onClose={store.handleModalClose}>
        {store.openMessageState && (
          <MessageModal
            title="메세지"
            message="message"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openEmergencyState} onClose={store.handleModalClose}>
        {store.openEmergencyState && (
          <EmergencyModal
            title="긴급"
            onCloseConfirm={store.handleModalClose}>
              <Emergency />
          `</EmergencyModal>
        )}
      </Modal>
      <Modal open={store.openNotificationState} onClose={store.handleModalClose}>
        {store.openNotificationState && (
          <NoticeModal
            title="알림"
            message="Check notifications"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openHealthState} onClose={store.handleModalClose}>
        {store.openHealthState && (
          <HealthModal
            title="건강"
            message="Check your health"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openSettingState} onClose={store.handleModalClose}>
        {store.openSettingState && (
          <SettingModal
            title="설정"
            onCloseConfirm={store.handleModalClose}>
              <ModalSettingBox />
          </SettingModal>
        )}
      </Modal>
    </>
  );
}
