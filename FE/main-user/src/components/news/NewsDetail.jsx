import React from "react";
import "./News.css";

export default function NewsDetail({ news, onReply }) {
    if (!news) {
      return <div className="news-unselected">뉴스를 선택하세요</div>;
    }
  
    return (
      <div className="news-detail">
        <h2>뉴스 상세</h2>
        <div className="news-content">
            <p className={`news-long-text ${news.type}`}>{news.text}</p>
        </div>
      </div>
    );
  }