import React, { useContext, useState } from "react";
import { DisasterStoreContext } from "../../store/disasterStore";
import NoticeBox from "./NoticeBox";
import NoticeDetail from "./NoticeDetail";
import "./Notice.css";

export default function Notice({ onReply }) {
  const { disasterData, isLoading, markNotificationAsRead, setDisasterData } = useContext(DisasterStoreContext);
  const [selectedNotice, setSelectedNotice] = useState(null);

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
    is_read: notice.is_read,
  })) : [];

  const allNotices = [...disasterNotices].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const koreaTimeOffset = 9 * 60 * 60 * 1000;
    const koreaDate = new Date(date.getTime() + koreaTimeOffset);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (koreaDate >= today) return "오늘";
    if (koreaDate >= yesterday) return "어제";
    
    return koreaDate.toISOString().split("T")[0];

    // const date = new Date(dateString);
    // date.setHours(date.getHours() + 9);

    // const today = new Date();
    // today.setHours(today.getHours() + 9);

    // const yesterday = new Date(today);
    // yesterday.setDate(today.getDate() - 1);

    // if (date.toDateString() === today.toDateString()) return "오늘";
    // if (date.toDateString() === yesterday.toDateString()) return "어제";
    // return date.toISOString().split("T")[0];  // YYYY-MM-DD
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const koreaTimeOffset = 9 * 60 * 60 * 1000;
    const koreaDate = new Date(date.getTime() + koreaTimeOffset);

    const hours = koreaDate.getHours();
    const minutes = koreaDate.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;

    return `${period} ${formattedHours}:${minutes}`;
    // const date = new Date(dateString);
    // date.setHours(date.getHours() + 9);
    
    // const hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, "0");
    // const period = hours >= 12 ? "오후" : "오전";
    // const formattedHours = hours % 12 || 12;

    // return `${period} ${formattedHours}:${minutes}`;
  };

  const openNotice = (notice) => {
    setSelectedNotice(notice);

    const extractedIndex = notice.id ? parseInt(notice.id.replace(/\D/g, ""), 10) : null;

    if (!notice.is_read && extractedIndex) {
        setDisasterData((prevData) => {
          const newData = prevData.map((item) =>
              item.index === extractedIndex ? { ...item, is_read: true } : item
          )
          return [...newData];
    });

        markNotificationAsRead(extractedIndex);
    }
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
              {allNotices.map((notice) => (
                <NoticeBox
                  key={notice.index}
                  notice={{ 
                    ...notice, 
                    time: formatTime(notice.created_at),
                    notification_grade: notice.notification_grade
                  }}
                  onClick={openNotice}
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