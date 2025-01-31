import React from "react";
import { useContext } from "react";
import { StoreContext } from "../../store/store.jsx";
import Chatting from "../message/Chatting";
import "./Modal.css";

export default function MessageModal({ title }) {
  const store = useContext(StoreContext);

  return (
    <div id="modal-body">
      <div id="modal-bar">
        <h2>{title}</h2>
      </div>
      <div id="chatting-area">
        <Chatting />
      </div>
      <button onClick={store.handleModalClose} className="button">
         닫기
      </button>
    </div>
  );
}