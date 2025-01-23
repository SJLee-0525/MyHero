import { useState, useContext, createContext } from "react";

import { UserProgressContext } from "./userProgressStore";

export const HealthContext = createContext({
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
          created_at: "2025-01-23 04:48:58",
          report_content: {
            overall_emotional_state: "",
            emotional_insights: "",
            time_based_emotions: {
              "": ["", 5, ""],
            },
            recommendations: [""],
          },
        },
      ],
    },
  },
  handleShowDetailReport: () => {},
});

export default function HealthContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

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
  const healthLog = [
    {
      date: "01-15",
      health: 57,
      mental: 65,
    },
    {
      date: "01-16",
      health: 72,
      mental: 90,
    },
    {
      date: "01-17",
      health: 85,
      mental: 88,
    },
    {
      date: "01-18",
      health: 68,
      mental: 72,
    },
    {
      date: "01-19",
      health: 72,
      mental: 82,
    },
    {
      date: "01-20",
      health: 59,
      mental: 67,
    },
    {
      date: "01-21",
      health: 69,
      mental: 80,
    },
  ];

  // 보고서
  const mentalReport = {
    data: [
      {
        id: 3,
        user_id: "test_user",
        created_at: "2025-01-23 04:48:58",
        report_content: {
          overall_emotional_state:
            "독거노인의 전반적인 감정 상태는 힘들고 부정적입니다.",
          emotional_insights:
            "사용자는 주로 '안녕'이라는 인사말을 많이 사용하며, 오늘 기분이 좋지 않다는 내용을 여러 차례 반복하였습니다. 이러한 상황에서는 사용자가 어떤 문제를 겪고 있는지 더욱 자세히 알아보는 것이 좋겠습니다.",
          time_based_emotions: {
            "09:00": [
              "중립적",
              50,
              "사용자가 아침에 '안녕'이라고 말하며 일상적인 대화를 시도했습니다.",
            ],
            "10:50": [
              "부정적",
              30,
              "사용자가 기분이 좋지 않다며 힘들게 느껴지는 것을 표현하였습니다.",
            ],
            "13:24": [
              "매우 부정적",
              10,
              "사용자가 다시 한 번 기분이 좋지 않다고 표현하며 이전보다 감정이 더욱 악화되었다는 것을 나타냈습니다.",
            ],
          },
          recommendations: [
            "사용자에게 자신의 기분을 표현할 수 있는 환경을 만들어주는 것이 중요합니다. 그리고 그 사람이 혼자가 아니라는 것을 느끼게 해주는 것이 좋겠습니다.",
            "사용자에게 의미있는 활동이나 취미를 찾아보는 것을 권장할 수 있습니다. 이를 통해 긍정적인 감정을 느끼게 해줄 수 있을 것입니다.",
          ],
        },
      },
    ],
  };

  function handleShowDetailReport() {
    userProgressStore.handleOpenModal("detail-mental-report");
  }

  const ctxValue = {
    keywords,
    keywordColors,
    healthLog,
    mentalReport,
    handleShowDetailReport,
  };

  return (
    <HealthContext.Provider value={ctxValue}>{children}</HealthContext.Provider>
  );
}
