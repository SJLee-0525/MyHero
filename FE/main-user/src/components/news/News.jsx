import React from "react";
import { useState } from "react";
import NewsBox from "./NewsBox";
import NewsDetail from "./NewsDetail";
import "./News.css";

export default function News({ onReply }) {
  const [selectedNews, setSelectedNews] = useState(null);
  const [readNews, setReadNews] = useState(new Set());
  // const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const news = [
    { id: 1, text: "으이잉ㅇㅇ", time: "16:07", date: "오늘" },
    { id: 2, text: "[행정안전부] 오늘 11시 10분 부산 호우경보 산사퉤", time: "14:02", date: "어제" },
    { id: 3, text: "[기장군] 호우경보 발효중.", time: "13:46", date: "어제" },
    { id: 4, text: "으갸갸갸갸", time: "12:05", date: "어제" },
  ];

  // 날짜별 그룹화
  const groupedNews = news.reduce((acc, news) => {
    if (!acc[news.date]) {
      acc[news.date] = [];
    }
    acc[news.date].push(news);
    return acc;
  }, {});

  // 선택한 공지사항을 우측에 띄우고 읽음 처리하는 함수
  const openNews = (news) => {
    setSelectedNews(news);
    setReadNewss((prev) => new Set([...prev, news.id]));
  };

  return (
    <div className="news-container">
      <div className="news-list">
        <div className="news-scroll">
          {Object.keys(groupedNews).map((date) => (
            <div key={date} className="news-group">
              <h2>{date}</h2>
              {groupedNews[date].map((news) => (
                <NewsBox
                  key={news.id}
                  news={news}
                  onClick={openNews}
                  isRead={readNews.has(news.id)} // 읽음 여부 전달
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <NewsDetail news={selectedNews} onReply={onReply} />
    </div>
  );
}