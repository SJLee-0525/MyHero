import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const WeatherStoreContext = createContext({
  weatherData: {},  // 날씨 데이터 저장
  isLoading: false, // 로딩 상태
  fetchWeatherData: () => {}, // 날씨 데이터 요청 함수
});

export default function WeatherStoreContextProvider({ children }) {
  const { request } = useMainHttp();
  const userProgressStore = useContext(UserProgressContext);

  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ API에서 날씨 데이터 가져오기
  async function fetchWeatherData() {
    setIsLoading(true);
    console.log("🌤️ 날씨 API 요청 시작...");

    try {
      if (!userProgressStore.DEV_API_URL) {
        throw new Error("❌ API URL이 설정되지 않음");
      }

      const response = await request(`${userProgressStore.DEV_API_URL}/tools/weather`);
      console.log("✅ 날씨 API 응답:", response);

      const resData = response.data;

      if (response.success && resData.message === "Weather retrieved successfully") {
        console.log("📢 날씨 데이터 저장:", resData.result);
        setWeatherData(resData.result); // ✅ API 응답의 result를 저장
      } else {
        console.error("❌ 날씨 데이터를 불러오는 중 오류 발생:", resData.error);
        setWeatherData({});
      }
    } catch (error) {
      console.error("❌ API 요청 실패:", error);
      setWeatherData({});
    } finally {
      setIsLoading(false);
      console.log("🛑 날씨 API 요청 종료");
    }
  }

  useEffect(() => {
    fetchWeatherData(); // 컴포넌트 마운트 시 날씨 데이터 가져오기
  }, []);

  const ctxValue = {
    weatherData,
    isLoading,
    fetchWeatherData,
  };

  return (
    <WeatherStoreContext.Provider value={ctxValue}>
      {children}
    </WeatherStoreContext.Provider>
  );
}