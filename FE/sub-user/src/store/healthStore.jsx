import { useEffect, useState, useContext, createContext } from "react";
import { useHttp } from "../hooks/useHttp";

import { UserProgressContext } from "./userProgressStore";

export const HealthContext = createContext({
  healthStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      heart_rate: 1,
    },
  ],
  activeStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      score: 0,
      action: "",
      is_critical: false,
      description: { title: "", data: 123.456 },
    },
  ],
  mentalStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      score: 5,
      is_critical: false,
      description: {
        overall_emotional_state: "",
        emotional_insights: "",
        time_based_emotions: {},
        recommendations: [],
      },
    },
  ],
  mentalReport: [
    {
      index: 3,
      family_id: "FlcuDLxVC9SolW70",
      reported_at: "2025-02-07T00:31:04",
      start_time: "2025-02-01T00:30:24",
      end_time: "2025-02-06T23:59:59",
      average_score: 90,
      critical_days: 2,
      best_day: "2025-02-03",
      worst_day: "2025-02-05",
      improvement_needed: false,
      summary: "또 다른 총평 요약",
    },
  ],
  keywords: [],
  keywordColors: [],
  healthLog: {
    data: [
      {
        date: "",
        health: 1,
        mental: 1,
      },
    ],
    mentalReport: {
      data: [
        {
          id: 3,
          user_id: "",
          created_at: "",
          report_content: {
            overall_emotional_state: "",
            emotional_insights: "",
            time_based_emotions: {},
            recommendations: [],
          },
        },
      ],
    },
  },
  handleShowDetailReport: () => {},
  handleGetHealthData: () => {},
  handleGetActiveStatus: () => {},
  handleGetMentalStatus: () => {},
  handleGetMentalReports: () => {},
});

export default function HealthContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

  const { request } = useHttp();

  const [healthStatus, setHealthStatus] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);
  const [mentalStatus, setMentalStatus] = useState([]);
  const [mentalReport, setMentalReport] = useState([]);

  // 대화 키워드 관련련
  const keywords = ["임영웅", "김치찌개", "두부", "여행", "병원"];
  const keywordColors = [
    ["#146152", "white"],
    ["#44803F", "white"],
    ["#B4CF66", "black"],
    ["#FFEC5C", "black"],
    ["#FF5A33", "white"],
  ];

  // 건강 점수수
  const healthLog = [];

  // 보고서
  // const mentalReport = {
  //   data: [
  //     {
  //       id: 3,
  //       user_id: "test_user",
  //       created_at: "2025-01-23 04:48:58",
  //       report_content: {
  //         overall_emotional_state:
  //           "독거노인의 전반적인 감정 상태는 힘들고 부정적입니다.",
  //         emotional_insights:
  //           "사용자는 주로 '안녕'이라는 인사말을 많이 사용하며, 오늘 기분이 좋지 않다는 내용을 여러 차례 반복하였습니다. 이러한 상황에서는 사용자가 어떤 문제를 겪고 있는지 더욱 자세히 알아보는 것이 좋겠습니다.",
  //         time_based_emotions: {
  //           "09:00": [
  //             "중립적",
  //             50,
  //             "사용자가 아침에 '안녕'이라고 말하며 일상적인 대화를 시도했습니다.",
  //           ],
  //           "10:50": [
  //             "부정적",
  //             30,
  //             "사용자가 기분이 좋지 않다며 힘들게 느껴지는 것을 표현하였습니다.",
  //           ],
  //           "13:24": [
  //             "매우 부정적",
  //             10,
  //             "사용자가 다시 한 번 기분이 좋지 않다고 표현하며 이전보다 감정이 더욱 악화되었다는 것을 나타냈습니다.",
  //           ],
  //         },
  //         recommendations: [
  //           "사용자에게 자신의 기분을 표현할 수 있는 환경을 만들어주는 것이 중요합니다. 그리고 그 사람이 혼자가 아니라는 것을 느끼게 해주는 것이 좋겠습니다.",
  //           "사용자에게 의미있는 활동이나 취미를 찾아보는 것을 권장할 수 있습니다. 이를 통해 긍정적인 감정을 느끼게 해줄 수 있을 것입니다.",
  //         ],
  //       },
  //     },
  //   ],
  // };

  // useEffect(() => {
  //   console.log("HealthContextProvider useEffect", familyId);
  //   if (!userProgressStore.loginUserInfo.login) return;

  //   if (userProgressStore.loginUserInfo.userInfo.role === "sub") {
  //     if (userProgressStore.memberInfo.selectedFamilyId) {
  //       const fetchData = async () => {
  //         await handleGetHealthData();
  //         await handleGetActiveStatus();
  //         await handleGetMentalStatus();
  //         await handleGetMentalReports();

  //         fetchData();
  //         console.log(123);
  //       };
  //     }
  //   }
  // }, [
  //   userProgressStore.loginUserInfo.login,
  //   userProgressStore.memberInfo.selectedFamilyId,
  // ]);

  const familyId = userProgressStore.memberInfo.selectedFamilyId;

  function handleShowDetailReport() {
    userProgressStore.handleOpenModal("detail-mental-report");
  }

  function getOneYearRangeUTC() {
    const now = new Date(); // 현재 시간 (UTC)
    const oneYearAgo = new Date();
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1); // UTC 기준 1년 전

    const formatUTCDate = (date) => date.toISOString().split(".")[0] + "Z"; // 밀리초 제거 후 'Z' 추가

    return {
      start: formatUTCDate(oneYearAgo),
      end: formatUTCDate(now),
    };
  }

  async function handleGetHealthData(
    inputStart = null,
    inputEnd = null,
    order = "desc"
  ) {
    const { start, end } = getOneYearRangeUTC();

    if (!inputStart) {
      inputStart = start;
    }

    if (!inputEnd) {
      inputEnd = end;
    }

    try {
      const response = await request(
        `${userProgressStore.DEV_API_URL}/status/health/${familyId}?start=${start}&end=${end}&order=${order}`
      );

      console.log("handleGetHealthData response", response);
      const resData = response.data;

      if (response.success) {
        if (resData.message === "Health status retrieved successfully") {
          setHealthStatus([...resData.data]);
        } else if (resData.message === "No health status found") {
          setHealthStatus([...resData.data]);
        }
      } else {
        console.error("최신 건강 정보 조회 실패:", resData.error);
        setHealthStatus([]);
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        };
      }
    } catch (error) {
      console.error(error);
      setHealthStatus([]);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  async function handleGetActiveStatus(
    inputStart = null,
    inputEnd = null,
    order = "desc"
  ) {
    const { start, end } = getOneYearRangeUTC();

    if (!inputStart) {
      inputStart = start;
    }

    if (!inputEnd) {
      inputEnd = end;
    }

    try {
      const response = await request(
        `${userProgressStore.DEV_API_URL}/status/active/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`
      );

      console.log("handleGetActiveStatus response", response);
      const resData = response.data;

      if (response.success) {
        if (resData.message === "Active status retrieved successfully") {
          setActiveStatus([...resData.data]);
        } else if (resData.message === "No active status found") {
          setActiveStatus([...resData.data]);
        }
      } else {
        console.error("최신 활동 정보 조회 실패:", resData.error);
        setActiveStatus([]);
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        };
      }
    } catch (error) {
      console.error(error);
      setActiveStatus([]);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  async function handleGetMentalStatus(
    inputStart = null,
    inputEnd = null,
    order = "desc"
  ) {
    const { start, end } = getOneYearRangeUTC();

    if (!inputStart) {
      inputStart = start;
    }

    if (!inputEnd) {
      inputEnd = end;
    }

    try {
      const response = await request(
        `${userProgressStore.DEV_API_URL}/status/mental/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`
      );

      console.log("handleGetMentalStatus response", response);
      const resData = response.data;

      if (response.success) {
        if (resData.message === "Mental status retrieved successfully") {
          setMentalStatus(
            resData.data.map((item) => ({
              ...item,
              description: JSON.parse(item.description.replace(/'/g, '"')), // 🔥 description을 객체로 변환
            }))
          );
        } else if (resData.message === "No mental status found") {
          setMentalStatus([...resData.data]);
        }
      } else {
        console.error("최신 정신 정보 조회 실패:", resData.error);
        setMentalStatus([]);
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        };
      }
    } catch (error) {
      console.error(error);
      setMentalStatus([]);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  async function handleGetMentalReports(
    inputStart = null,
    inputEnd = null,
    order = "desc"
  ) {
    const { start, end } = getOneYearRangeUTC();

    if (!inputStart) {
      inputStart = start;
    }

    if (!inputEnd) {
      inputEnd = end;
    }

    try {
      const response = await request(
        `${userProgressStore.DEV_API_URL}/status/mental-reports/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`
      );

      console.log("handleGetMentalReports response", response);
      const resData = response.data;

      if (response.success) {
        if (resData.message === "Mental reports retrieved successfully") {
          setMentalReport([...resData.data]);
        } else if (resData.message === "No mental reports found") {
          setMentalReport([...resData.data]);
        }
      } else {
        console.error("최신 정신 보고서 조회 실패:", resData.error);
        setMentalReport([]);
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        };
      }
    } catch (error) {
      console.error(error);
      setMentalReport([]);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  const ctxValue = {
    healthStatus,
    activeStatus,
    mentalStatus,
    mentalReport,
    keywords,
    keywordColors,
    healthLog,
    handleShowDetailReport,
    handleGetHealthData,
    handleGetActiveStatus,
    handleGetMentalStatus,
    handleGetMentalReports,
  };

  return (
    <HealthContext.Provider value={ctxValue}>{children}</HealthContext.Provider>
  );
}
