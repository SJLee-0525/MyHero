import React, { useContext, useState } from "react";
import { DisasterStoreContext } from "../../store/disasterStore";
import NoticeBox from "./NoticeBox";
import NoticeDetail from "./NoticeDetail";
import "./Notice.css";

export default function Notice({ onReply }) {
  const { disasterData, isLoading } = useContext(DisasterStoreContext);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());

  // ✅ 기존 일반 알림 (임시 데이터)
  const notices = [
    { id: "info-1", text: "택배가 도착했습니다.", created_at: "2025-02-11T08:30:00", type: "info" },
    { id: "info-2", text: "일정 알림: 병원 방문", created_at: "2025-02-11T10:15:00", type: "schedule" },
  ];

  const disasterNotices = Array.isArray(disasterData) ? disasterData.map(notice => ({
    id: `warn-${notice.index}`,
    text: (() => {
      try {
        return JSON.parse(notice.description).MSG_CN || notice.description;
      } catch (e) {
        return notice.description;
      }
    })(),
    created_at: notice.created_at,
    type: "warn",
  })) : [];

  const allNotices = [...notices, ...disasterNotices].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "오늘";
    if (date.toDateString() === yesterday.toDateString()) return "어제";
    return date.toISOString().split("T")[0];  // YYYY-MM-DD
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // 읽음 처리
  const openNotice = (notice) => {
    setSelectedNotice(notice);
    setReadNotices((prev) => new Set([...prev, notice.id]));
  };

  // 날짜별 그룹화
  const groupedNotices = allNotices.reduce((acc, notice) => {
    const dateKey = formatDate(notice.created_at);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(notice);
    return acc;
  }, {});

  return (
    <div className="notice-container">
      <div className="notice-list">
        <div className="notice-scroll">
          {Object.entries(groupedNotices).map(([date, notices]) => (
            <div key={date} className="notice-group">
              <h2>{date}</h2>
              {notices.map((notice) => (
                <NoticeBox
                  key={notice.id}
                  notice={{ ...notice, time: formatTime(notice.created_at)}}
                  onClick={openNotice}
                  isRead={readNotices.has(notice.id)}
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