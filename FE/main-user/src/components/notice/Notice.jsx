import React, { useContext, useState } from "react";
import { DisasterStoreContext } from "../../store/disasterStore";
import NoticeBox from "./NoticeBox";
import NoticeDetail from "./NoticeDetail";
import "./Notice.css";

export default function Notice({ onReply }) {
  const { disasterData, isLoading } = useContext(DisasterStoreContext);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());

  const disasterNotices = Array.isArray(disasterData) ? disasterData.map(notice => ({
    id: `disaster-${notice.index}`,
    text: (() => {
      try {
        return JSON.parse(notice.description).MSG_CN || notice.description;
      } catch (e) {
        return notice.description;
      }
    })(),
    created_at: notice.created_at,
    notification_grade: notice.notification_grade || "info",
  })) : [];

  const allNotices = [...disasterNotices].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9);

    const today = new Date();
    today.setHours(today.getHours() + 9);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "오늘";
    if (date.toDateString() === yesterday.toDateString()) return "어제";
    return date.toISOString().split("T")[0];  // YYYY-MM-DD
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9);
    // return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;

    return `${period} ${formattedHours}:${minutes}`;
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
                  notice={{ 
                    ...notice, 
                    time: formatTime(notice.created_at),
                    notification_grade: notice.notification_grade
                  }}
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