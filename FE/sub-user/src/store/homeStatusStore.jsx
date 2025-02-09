import { useState, createContext, useEffect, useContext } from "react"
import { useHttp } from "../hooks/useHttp"

import { UserProgressContext } from "./userProgressStore"

export const HomeStatusContext = createContext({
  homeStatus: {
    data: {
      family_id: null,
      reported_at: null,
      temperature: null,
      humidity: null,
      dust_level: null,
      ethanol: null,
      others: { finedust: null, ultrafinedust: null },
    },
  },
  setHomeStatus: () => {},
})

export default function HomeStatusContextProvider({ children }) {
  const { request, loading } = useHttp()

  const userProgressStore = useContext(UserProgressContext)

  const [homeStatus, setHomeStatus] = useState({
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

  // useEffect(() => {
  //   try {
  //     if (!userProgressStore.loginUserInfo.login) return;

  //     if (userProgressStore.loginUserInfo.userInfo.role === "sub") {
  //       if (userProgressStore.memberInfo.selectedFamilyId) {
  //         const fetchData = async () => {
  //           await handleGetLatestHomeStatus(
  //             userProgressStore.memberInfo.selectedFamilyId
  //           );
  //         };

  //         fetchData();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("최신 집 정보 가져오기 실패", error);
  //   }
  // }, [
  //   userProgressStore.loginUserInfo.login,
  //   userProgressStore.memberInfo.selectedFamilyId,
  // ]);

  let familyId = ""
  if (userProgressStore.loginUserInfo.userInfo?.role === "sub") {
    familyId = userProgressStore.memberInfo.selectedFamilyId
  } else if (userProgressStore.loginUserInfo.userInfo?.role === "main") {
    familyId = userProgressStore.familyInfo.familyInfo?.id
  }

  async function handleGetLatestHomeStatus() {
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
          setHomeStatus({
            data: resData.data,
          })
          return {
            success: true,
            data: resData.data,
          }
        }
      } else {
        console.error("최신 집 내부 정보 조회 실패:", response.error)
        setHomeStatus({
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
    homeStatus,
    setHomeStatus,
    handleGetLatestHomeStatus,
  }

  return <HomeStatusContext.Provider value={ctxValue}>{children}</HomeStatusContext.Provider>
}
