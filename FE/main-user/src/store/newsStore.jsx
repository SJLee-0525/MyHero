import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const NewsStoreContext = createContext({
  newsData: {},
  isLoading: false,
  fetchNewsData: () => {},
});

export default function NewsStoreContextProvider({ children }) {
  const { request } = useMainHttp();
  const userProgressStore = useContext(UserProgressContext);

  const [newsData, setNewsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function fetchNewsData() {
    setIsLoading(true);

    try {
      if(!userProgressStore.loginUserInfo.login) return;
      
      const response = await request(`${userProgressStore.DEV_API_URL}/tools/news`);
      const resData = response.data;
      
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
    fetchNewsData();
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