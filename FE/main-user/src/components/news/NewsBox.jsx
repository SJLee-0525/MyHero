import React, { useContext } from "react";
import { NewsStoreContext } from "../../store/newsStore";
import NewsDetail from "./NewsDetail";
import "./News.css";

export default function NewsBoxPage({ category, newsData, onBack }) {
  const { selectedNews, selectNews, clearSelectedNews } = useContext(NewsStoreContext);

  if (selectedNews) {
    return <NewsDetail news={selectedNews} onBack={clearSelectedNews} />
  }

  return (
    <div className="news-box-page">
      <div className="news-header"> 
        <button className="back-button" onClick={onBack}>←</button>
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)} 뉴스</h2>
      </div>

      <div className="news-list">
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <div key={news.id} className="news-box" onClick={() => selectNews(news)}>
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