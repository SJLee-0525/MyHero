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
          <h3>{news.title}</h3>
          <img src={news.image_url} alt="News" className="news-detail-image" />
          <p className="news-meta">{new Date(news.pub_date).toLocaleDateString()}</p>
          <p className="news-text">{news.text}</p>
        </div>
      </div>
    );
  }