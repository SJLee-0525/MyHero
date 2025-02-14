import React from "react";
import "./News.css";

export default function NewsDetail({ news, onBack }) {
    if (!news) {
      return <div className="news-unselected">뉴스를 선택하세요</div>;
    }
  
    return (
      <div className="news-detail">
        <div className="news-content">
          <button className="back-button-detail" onClick={onBack}>←</button>
          <iframe 
            src={news.link} 
            className="news-iframe" 
            title="News Detail"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>
    );
  }