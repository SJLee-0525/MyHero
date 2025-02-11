import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const NewsStoreContext = createContext({
  newsData: {},
  isLoading: false,
  fetchNewsData: () => {},
});

export default function NewsStoreContextProvider({ children }) {
  const { request, loading, error } = useMainHttp();
  const userProgressStore = useContext(UserProgressContext);

  const [newsData, setNewsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ API에서 뉴스 데이터 가져오기
  async function fetchNewsData() {
    setIsLoading(true);

    try {
      const response = await request(`${userProgressStore.DEV_API_URL}/tools/news`); // API 호출
      const resData = response.data; // JSON 변환
      
      if (response.success) {
        if (resData.message === "News retrieved successfully") {
          setNewsData(resData.result);
        }
      } else {
        console.error("뉴스 데이터를 불러오는 중 오류 발생:", resData.error);
        setNewsData({});
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setNewsData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
  }, []);

  const ctxValue = {
    newsData,
    isLoading,
    fetchNewsData,
  };

  return (
    <NewsStoreContext.Provider value={ctxValue}>
      {children}
    </NewsStoreContext.Provider>
  );
}