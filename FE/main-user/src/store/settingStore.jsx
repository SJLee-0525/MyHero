import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const SettingStoreContext = createContext({
    backgrounds: [],
    alertState: true,
    cameraState: true,
    driveState: true,
    micState: true,
    fetchBackgrounds: () => {},
    addBackground: () => {},
    toggleFeature: () => {},
    fetchSettings: () => {},
  });
  
  export function useSettingStore() {
    return useContext(SettingStoreContext);
  }

  export default function SettingStoreContextProvider({ children }) {
    const { request } = useMainHttp();
    const userProgressStore = useContext(UserProgressContext);
    const [socket, setSocket] = useState(null);
    const [backgrounds, setBackgrounds] = useState([]);

    const [settings, setSettings] = useState({
        alertState: false,
        cameraState: false,
        driveState: false,
        micState: false,
    });

    const familyId = userProgressStore.familyInfo?.familyId || "";

    // ✅ WebSocket 연결 함수
    const connectWebSocket = () => {
        if (socket && socket.readyState === WebSocket.OPEN) return;

        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsUrl = `${protocol}70.12.247.214:8765`;

        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => console.log("✅ WebSocket 연결 성공!");
            ws.onerror = (error) => console.error("❌ WebSocket 오류 발생:", error);
            ws.onclose = () => console.log("⚠️ WebSocket 연결 해제됨. 재연결을 시도할 수 있습니다.");
            
            setSocket(ws);
        } catch (error) {
            console.error("❌ WebSocket 초기화 실패:", error);
        }
    };

    // 웹 소켓 설정
    useEffect(() => {
        connectWebSocket();
        
        return () => {
            if (socket) socket.close();
        };
    }, []);

    // const sendWebSocket = async (data) => {
    //     try {
    //         if (socket?.readyState === WebSocket.CLOSED) {
    //             const ws = new WebSocket('ws://localhost:8765');
    //             await new Promise((resolve, reject) => {
    //                 ws.onopen = () => resolve();
    //                 ws.onerror = () => reject();
    //             });
    //             setSocket(ws);
    //         }
    
    //         if (socket?.readyState === WebSocket.OPEN) {
    //             const wsMessage = {
    //                 type: "settings",
    //                 data: data
    //             };
    //             socket.send(JSON.stringify(wsMessage));
    //             return true;
    //         }
    //         return false;
    //     } catch (error) {
    //         console.error('WebSocket send error:', error);
    //         return false;
    //     }
    // }

    // ✅ WebSocket을 통한 데이터 전송 함수
    const sendWebSocket = async (data) => {
        try {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                console.warn("⚠️ WebSocket이 닫혀 있어 재연결을 시도합니다.");
                connectWebSocket();
                return false;
            }

            const wsMessage = { type: "settings", data };
            socket.send(JSON.stringify(wsMessage));
            return true;
        } catch (error) {
            console.error("❌ WebSocket 전송 오류:", error);
            return false;
        }
    };

    async function fetchSettings() {
        if (!familyId) return;

        try {
            const response = await request(
                `${userProgressStore.DEV_API_URL}/tools/settings/${familyId}`,
                "GET"
            );
            
            const resData = response.data;
            
            if (response.success && resData.message === "Settings retrieved successfully") {
                console.log("✅ 서버에서 설정 값 불러오기 성공:", resData);

                setSettings({
                    alertState: resData.result.is_alarm_enabled,
                    cameraState: resData.result.is_camera_enabled,
                    driveState: resData.result.is_driving_enabled,
                    micState: resData.result.is_microphone_enabled,
                });
            }
        } catch (error) {
            console.error("❌ 설정 값 불러오기 실패:", error);
        }
    }

    async function audioToggle() {
        try {
            const updatedMicState = !settings.micState;
            setSettings((prev) => ({ ...prev, micState: updatedMicState }));

            const response = await request(`http://70.12.247.214:8001/bluetooth/speaker/toggle`, "POST");

            const resData = response.data;

            if (response.success && resData.message === "Speaker and microphone settings updated") {
                console.log("✅ 마이크 상태 변경 성공:", resData);
            } else {
                console.error("❌ 마이크 상태 변경 실패:", response.error);
                setSettings((prev) => ({ ...prev, micState: !updatedMicState }));
            }
        } catch (error) {
            console.error("❌ 네트워크 오류 발생:", error);
            setSettings((prev) => ({ ...prev, micState: !prev.micState }));
        }
    }

    async function toggleFeature(featureKey) {
        if (!familyId) return;

        const updatedSettings = {
            ...settings,
            [featureKey]: !settings[featureKey],
        };

        setSettings(updatedSettings);

        try {
            const response = await request(
                `${userProgressStore.DEV_API_URL}/tools/settings/${familyId}`,
                "PATCH",
                { 
                    is_alarm_enabled: updatedSettings.alertState,
                    is_camera_enabled: updatedSettings.cameraState,
                    is_microphone_enabled: updatedSettings.micState,
                    is_driving_enabled: updatedSettings.driveState,
                }
            );
            
            sendWebSocket({ 
                is_alarm_enabled: updatedSettings.alertState,
                is_camera_enabled: updatedSettings.cameraState,
                is_microphone_enabled: updatedSettings.micState,
                is_driving_enabled: updatedSettings.driveState,
            });

            console.log("📡 PATCH 요청 결과:", response);

            if (!response.success) {
                setSettings(settings);
                console.error(`❌ ${featureKey} 상태 변경 실패:`, response.error);
            } else {
                console.log(`✅ ${featureKey} 상태 변경 성공:`, updatedSettings);
            }
        } catch (error) {
            console.error(`❌ ${featureKey} 상태 변경 중 오류 발생:`, error);
        }
    }

    async function fetchBackgrounds() {
        if (!familyId) return;

        try {
            const response = await request(
                `${userProgressStore.DEV_API_URL}/tools/background/${familyId}?uploader=mine`,
                "GET"
            );

            const resData = response.data;

            if (response.success) {
                setBackgrounds(resData.result.map(bg => ({
                    index: bg.id,
                    imageUrl: bg.image_url
                })));
            } else {
                console.warn("⚠️ 배경화면 목록이 비어 있습니다.");
                setBackgrounds([]);
            }
        } catch (error) {
            console.error("❌ 배경화면 목록 불러오기 실패:", error);
        }
    }

    async function addBackground(imageUrl) {
        if (!imageUrl || !familyId) return;

        try {
            const response = await request(`${userProgressStore.DEV_API_URL}/tools/background`, "POST", {
                family_id: familyId,
                image_url: imageUrl,
            });

            const resData = response.data;

            if (response.success && resData.result) {
                alert("📸 이미지가 저장되었습니다!");
            } else {
                console.error("❌ 배경 추가 실패:", response.error);
                alert("❌ 이미지 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("❌ 네트워크 오류:", error);
            alert("❌ 네트워크 오류로 인해 저장에 실패했습니다.");
        }
    }

    useEffect(() => {
        if (familyId) {
            fetchSettings();
        }
    }, [familyId]);
  
    const ctxValue = {
        backgrounds,
        ...settings,
        fetchBackgrounds,
        addBackground,
        toggleFeature,
        fetchSettings,
        audioToggle,
    };
  
    return (
        <SettingStoreContext.Provider value={ctxValue}>
            {children}
        </SettingStoreContext.Provider>
    );
  }  