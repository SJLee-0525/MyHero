import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const DisasterStoreContext = createContext({
    disasterData: [],
    isLoading: false,
    fetchDisasterData: () => {},
    markNotificationAsRead: () => {},
    setDisasterData: () => {},
});

export default function DisasterStoreContextProvider({ children }) {
    const { request } = useMainHttp();
    const userProgressStore = useContext(UserProgressContext);

    const [disasterData, setDisasterData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let familyId = userProgressStore.familyInfo?.familyId || "";

    async function fetchDisasterData() {
        if(!familyId) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await request(`${userProgressStore.DEV_API_URL}/notify/all/${encodeURIComponent(familyId)}?order=desc`);
            const resData = response.data;

            if (response.success && resData.message === "All notifications retrieved successfully") {
                console.log("재난 데이터 저장:", resData.result);
                setDisasterData(resData.result);
            } else {
                console.error("재난 데이터를 불러오는 중 오류 발생:", resData.error);
                setDisasterData([]);
            }
        } catch (error) {
            console.error("API 요청 실패:", error);
            setDisasterData([]);
        } finally {
            setIsLoading(false);
            console.log("재난 API 요청 종료");
        }
    }

    async function markNotificationAsRead(notificationIndex) {
        try {
            console.log(`📡 PATCH 요청: /notify/read/${notificationIndex}`);
            const response = await request(
                `${userProgressStore.DEV_API_URL}/notify/read/${notificationIndex}`,
                "PATCH",
                { is_read: true },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.success && response.data?.result) {
                console.log(`✅ 알림(${notificationIndex}) 읽음 처리 완료`, response.data.result);

                setDisasterData((prevData) =>
                    prevData.map((item) =>
                        item.index === notificationIndex ? { ...item, is_read: true } : item
                    )
                );
            } else {
                console.error(`❌ 알림(${notificationIndex}) 읽음 처리 실패`, response.error);
            }
        } catch (error) {
            console.error(`❌ 알림(${notificationIndex}) 읽음 처리 중 오류 발생`, error);
        }
    }

    useEffect(() => {
        if (familyId) {
            fetchDisasterData();
            const interval = setInterval(fetchDisasterData, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [familyId]);

    const ctxValue = {
        disasterData,
        isLoading,
        fetchDisasterData,
        markNotificationAsRead,
        setDisasterData,
    };

    return (
        <DisasterStoreContext.Provider value={ctxValue}>
            {children}
        </DisasterStoreContext.Provider>
    );
}