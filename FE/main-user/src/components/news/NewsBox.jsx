import React from "react";
import "./News.css";

export default function NewsBoxPage({ category, newsData, onBack }) {
  return (
    <div className="news-box-page">
      <button className="back-button" onClick={onBack}>← 뒤로 가기</button>
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)} 뉴스</h2>

      <div className="news-list">
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <div key={news.id} className="news-box" onClick={() => window.open(news.link, "_blank")}>
              <img src={news.image_url} alt="News" className="news-image" />
              <div className="news-info">
                <h3 className="news-title">{news.title}</h3>
                <p className="news-meta">
                  {new Date(news.pub_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="news-unselected">해당 카테고리 뉴스가 없습니다.</p>
        )}
      </div>
    </div>
  );
}