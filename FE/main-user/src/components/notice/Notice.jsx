import React from "react";
import { useState } from "react";
import NoticeBox from "./NoticeBox";
import NoticeDetail from "./NoticeDetail";
// import MessageModal from "../modal/MessageModal";
import "./Notice.css";

export default function Notice({ onReply }) {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());
  // const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const notices = [
    { id: 1, text: "아들에게서 메세지가 도착했습니다.", time: "16:07", date: "오늘", type: "message" },
    { id: 2, text: "[행정안전부] 오늘 11시 10분 부산 호우경보 산사태      ", time: "14:02", date: "어제", type: "warning" },
    { id: 3, text: "[기장군] 호우경보 발효중.", time: "13:46", date: "어제", type: "warning" },
    { id: 4, text: "아들에게서 메세지가 도착했습니다.", time: "12:05", date: "어제", type: "message" },
    { id: 5, text: "긴급 재난 문자 발송", time: "09:15", date: "2024-01-29", type: "warning" },
    { id: 6, text: "택배가 도착했습니다.", time: "08:30", date: "2024-01-28", type: "ex" }
  ];

  // 날짜별 그룹화
  const groupedNotices = notices.reduce((acc, notice) => {
    if (!acc[notice.date]) {
      acc[notice.date] = [];
    }
    acc[notice.date].push(notice);
    return acc;
  }, {});

  // 선택한 공지사항을 우측에 띄우고 읽음 처리하는 함수
  const openNotice = (notice) => {
    setSelectedNotice(notice);
    setReadNotices((prev) => new Set([...prev, notice.id]));
  };

  // const openMessageModal = () => {
  //   setMessageModalOpen(true);
  // };

  // if (isMessageModalOpen) {
  //   return <MessageModal onClose={() => setMessageModalOpen(false)} />;
  // }

  return (
    <div className="notice-container">
      <div className="notice-list">
        <div className="notice-scroll">
          {Object.keys(groupedNotices).map((date) => (
            <div key={date} className="notice-group">
              <h2>{date}</h2>
              {groupedNotices[date].map((notice) => (
                <NoticeBox
                  key={notice.id}
                  notice={notice}
                  onClick={openNotice}
                  isRead={readNotices.has(notice.id)} // 읽음 여부 전달
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <NoticeDetail notice={selectedNotice} onReply={onReply} />
    </div>
  );
}