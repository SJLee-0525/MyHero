import { useState, createContext, useEffect, useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const SettingStoreContext = createContext({
    alertState: true,
    cameraState: true,
    driveState: true,
    micState: true,
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

    const [settings, setSettings] = useState({
        alertState: false,
        cameraState: false,
        driveState: false,
        micState: false,
    });

    const familyId = userProgressStore.familyInfo?.familyId || "";

    // 웹 소켓 설정
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8765');
        
        ws.onopen = () => {
            console.log('웹 소켓 연결');
        };

        ws.onerror = (error) => {
            console.error('웹 소켓 에러:', error);
        };

        ws.onclose = () => {
            console.log('웹 소켓 연결 해제');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendWebSocket = async (data) => {
        try {
            if (socket?.readyState === WebSocket.CLOSED) {
                const ws = new WebSocket('ws://localhost:8765');
                await new Promise((resolve, reject) => {
                    ws.onopen = () => resolve();
                    ws.onerror = () => reject();
                });
                setSocket(ws);
            }
    
            if (socket?.readyState === WebSocket.OPEN) {
                const wsMessage = {
                    type: "settings",
                    data: data
                };
                socket.send(JSON.stringify(wsMessage));
                return true;
            }
            return false;
        } catch (error) {
            console.error('WebSocket send error:', error);
            return false;
        }
    }

    // 📌 1️⃣ 초기 설정값 불러오기 (GET 요청)
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

            const response = await request(`http://70.12.247.214:8001/bluetooth/speaker/toggle`, "POST", { is_microphone_enabled: updatedMicState });

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

    // 📌 2️⃣ 상태를 PATCH 요청으로 변경
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
            
            // 웹 소켓에 변경값 전송
            sendWebSocket({ 
                is_alarm_enabled: updatedSettings.alertState,
                is_camera_enabled: updatedSettings.cameraState,
                is_microphone_enabled: updatedSettings.micState,
                is_driving_enabled: updatedSettings.driveState,
            });

            console.log("📡 PATCH 요청 결과:", response);

            if (!response.success) {
                // 🔥 3️⃣ 요청 실패 시 원래 상태로 복구
                setSettings(settings);
                console.error(`❌ ${featureKey} 상태 변경 실패:`, response.error);
            } else {
                console.log(`✅ ${featureKey} 상태 변경 성공:`, updatedSettings);
            }
        } catch (error) {
            // 🔥 4️⃣ 네트워크 오류 발생 시 원래 상태로 복구
            console.error(`❌ ${featureKey} 상태 변경 중 오류 발생:`, error);
        }
    }

    useEffect(() => {
        if (familyId) {
            fetchSettings();
        }
    }, [familyId]);
  
    const ctxValue = {
      ...settings,
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