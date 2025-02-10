import { createContext, useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { UserProgressContext } from "./userProgressStore";

export const EnvironmentData = createContext({
    environmentData: {
        data: {
            family_id: null,
            reported_at: null,
            temperature: "--",
            humidity: "--",
            dust: "--",
            ethanol: "--",
            others: { finedust: "--", ultrafindedust: "--" },
        },
    },
    setEnvironmentData: () => {},
})

export default function HomeStatusProvider({ children }) {
    const { request, loading, error } = useMainHttp();
    const userProgressStore = useContext(UserProgressContext);

    const [environmentData, setEnvironmentData] = useState({
        data: {
            family_id: null,
            reported_at: null,
            temperature: "--",
            humidity: "--",
            dust: "--",
            ethanol: "--",
            others: { finedust: "--", ultrafindedust: "--" },
        },
    });

    let familyId = ""
    if (userProgressStore.loginUserInfo.userInfo?.role === "sub") {
        familyId = userProgressStore.memberInfo.selectedFamilyId
    } else if (userProgressStore.loginUserInfo.userInfo?.role === "main") {
        familyId = userProgressStore.familyInfo.familyInfo?.id
    }

    async function handleGetLatestEnvironmentData() {
        if (!familyId) {
        console.error("가족 ID가 없습니다.")
        return {
            success: false,
            error: {
            type: "no_family_id",
            message: "가족 ID가 없습니다.",
            },
        }
        }

        try {
        const response = await request(`${userProgressStore.DEV_API_URL}/status/home/latest/${encodeURIComponent(familyId)}`)

        const resData = response.data
        if (response.success) {
            if (resData.message === "Home status retrieved successfully") {
            setEnvironmentData({
                data: resData.data,
            })
            return {
                success: true,
                data: resData.data,
            }
            }
        } else {
            console.error("최신 집 내부 정보 조회 실패:", response.error)
            setEnvironmentData({
            data: {
                family_id: null,
                reported_at: null,
                temperature: null,
                humidity: null,
                dust_level: null,
                ethanol: null,
                others: { finedust: null, ultrafinedust: null },
            },
            })
            return {
            success: false,
            error: {
                type: response.error.type,
                message: response.error.message,
            },
            }
        }
        } catch (error) {
        console.error(error)
        return {
            success: false,
            error: {
            type: "network_error",
            message: "네트워크 오류가 발생했습니다.",
            },
        }
        }
    }

    const ctxValue = {
        loading,
        environmentData,
        setEnvironmentData,
        handleGetLatestEnvironmentData,
    }

    return <EnvironmentData.Provider value={ctxValue}>{children}</EnvironmentData.Provider>
}