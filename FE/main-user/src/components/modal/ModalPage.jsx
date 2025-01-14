import { useContext } from "react";

import { StoreContext } from "../../store/store.jsx";

import Modal from "./Modal.jsx";
import MessageModal from "./MessageModal.jsx";

export default function ModalPage() {
  const store = useContext(StoreContext);

  return (
    <>
      <Modal open={store.openMessageState} onClose={store.handleModalClose}>
        {store.openMessageState && (
          <MessageModal
            title="Message"
            message="message"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openEmergencyState} onClose={store.handleModalClose}>
        {store.openEmergencyState && (
          <MessageModal
            title="Emergency Alert"
            message="alert"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal
        open={store.openNotificationState}
        onClose={store.handleModalClose}
      >
        {store.openNotificationState && (
          <MessageModal
            title="Notification"
            message="Check notifications"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openHealthState} onClose={store.handleModalClose}>
        {store.openHealthState && (
          <MessageModal
            title="Health"
            message="Check your health"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
      <Modal open={store.openSettingState} onClose={store.handleModalClose}>
        {store.openSettingState && (
          <MessageModal
            title="Setting"
            message="This is setting"
            onCloseConfirm={store.handleModalClose}
          />
        )}
      </Modal>
    </>
  );
}
