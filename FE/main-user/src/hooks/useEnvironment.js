import { useEffect } from "react";
import { useState } from "react";
import { useMainHttp } from "./useMainHttp";

export default function useEnvironment(familyId) {
    const { request, loading, error } = useMainHttp();
    const [environmentData, setEnvironmentData] = useState({
        temperature: "--",
        humidity: "--",
        dust: "--",
        ethanol: "--"
    });
    
    useEffect(() => {
        if (!familyId) return;

        const fetchEnvironmentData = async () => {
            try {
                const response = await request(`/status/home/latest/${familyId}`);
        
                if (response.success) {
                    const { temperature, humidity, dust_level, ethanol } = response.data;
                    setEnvironmentData({
                        temperature,
                        humidity,
                        dust: dust_level,
                        ethanol
                    });
                } else {
                    console.error("환경 데이터 로드 실패:", response.error);
                }
            } catch (error) {
                console.error("환경 데이터를 불러오는 중 오류 발생:", error);
            }
        };
    
        fetchEnvironmentData();
    }, [familyId]);
    
    return { environmentData, loading, error };
    }