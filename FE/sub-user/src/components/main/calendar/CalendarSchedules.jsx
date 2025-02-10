import { useContext, useRef } from "react";

import { CalendarStoreContext } from "../../../store/calendarStore";
import { HealthContext } from "../../../store/healthStore";

import MentalReportDetail from "../mental/MentalReportDetail";

import activityImage from "../../../assets/icons/run.svg";
import mindfulnessImage from "../../../assets/icons/mindfulness.svg";
import thermostatImage from "../../../assets/icons/thermostat.svg";
import airImage from "../../../assets/icons/airwave.svg";
import heatImage from "../../../assets/icons/heat.svg";
import humidityImage from "../../../assets/icons/humidity.svg";

export default function CalendarSchedules() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);
  const { mentalStatus, handleShowDetailReport } = useContext(HealthContext);

  const healthData = schedules.schedules.health;
  const mentalData = schedules.schedules.mental;
  const homeStatusData = schedules.schedules.homeStatus;

  const inputScheduleRef = useRef(""); // ref 초기화

  function handleOpenSpecificMentalReport(targetIndex) {
    const copyMentalStatus = [...mentalStatus];

    const arrayIndex = copyMentalStatus.findIndex(
      (report) => report.index === targetIndex
    );

    if (arrayIndex !== -1) {
      // 선택된 감정 보고서 출력
      handleShowDetailReport(arrayIndex);
    } else {
      console.error("해당되는 감정 보고서를 찾을 수 없습니다.");
    }
  }

  function handleSubmitSchedule(event) {
    event.preventDefault();

    const newSchedule = inputScheduleRef.current.value; // 입력값 가져오기
    if (newSchedule.trim()) {
      schedules.addSchedule(selectedDate.date, newSchedule); // 새 일정 추가
      inputScheduleRef.current.value = ""; // 입력값 초기화
    }
  }
  // {
  //   "2025-02-06": {
  //     "records": [
  //       {
  //         "index": 1,
  //         "family_id": "FlcuDLxVC9SolW70",
  //         "reported_at": "2025-02-06T06:56:30.000Z",
  //         "score": 80,
  //         "action": "활동의 이름",
  //         "is_critical": false,
  //         "description": {
  //           "title": "활동 보고서",
  //           "data": 123.456
  //         }
  //       },
  //       {
  //         "index": 3,
  //         "family_id": "FlcuDLxVC9SolW70",
  //         "reported_at": "2025-02-06T06:56:30.000Z",
  //         "score": 80,
  //         "action": "활동의 이름",
  //         "is_critical": false,
  //         "description": {
  //           "title": "활동 보고서",
  //           "data": 123.456
  //         }
  //       }
  //     ],
  //     "averageScore": 80
  //   }
  // }

  // {
  //   "2025-02-07": {
  //     "records": [
  //       {
  //         "index": 28,
  //         "family_id": "FlcuDLxVC9SolW70",
  //         "reported_at": "2025-02-07T13:48:39.000Z",
  //         "score": 50,
  //         "is_critical": true,
  //         "description": {
  //           "overall_emotional_state": "감정 상태 분석이 필요합니다.",
  //           "emotional_insights": "더 많은 대화가 필요합니다.",
  //           "time_based_emotions": {
  //             "01:55": [
  //               "중립",
  //               50,
  //               "감정 상태를 분석할 수 없습니다."
  //             ]
  //           },
  //           "recommendations": [
  //             "더 많은 대화를 나누어보세요."
  //           ]
  //         }
  //       },
  //       {
  //         "index": 27,
  //         "family_id": "FlcuDLxVC9SolW70",
  //         "reported_at": "2025-02-07T03:57:41.000Z",
  //         "score": 95,
  //         "is_critical": false,
  //         "description": {
  //           "overall_emotional_state": "대체로 안정적이나 때때로 고독함을 느낌",
  //           "emotional_insights": "사용자는 대체로 안정적인 감정 상태를 보이며, 일상적인 대화를 즐깁니다. 그러나 때때로 고독함을 느끼는 것으로 보입니다. 이는 사용자가 혼자 있는 시간이 많거나, 사회적인 상호작용이 부족한 것을 의미할 수 있습니다.",
  //           "time_based_emotions": {
  //             "13:42": [
  //               "긍정적",
  //               70,
  //               "독서에 대한 이야기를 나누며 긍정적인 감정을 표현함"
  //             ],
  //             "17:33": [
  //               "부정적",
  //               40,
  //               "대화를 별로 좋아하지 않는다고 표현함"
  //             ],
  //             "17:34": [
  //               "긍정적",
  //               60,
  //               "옛날 이야기를 나누고 싶어하는 긍정적인 감정을 표현함"
  //             ],
  //             "18:04": [
  //               "긍정적",
  //               70,
  //               "가을 날씨를 좋아하는 긍정적인 감정을 표현함"
  //             ],
  //             "18:05": [
  //               "부정적",
  //               30,
  //               "고독함을 느끼는 부정적인 감정을 표현함"
  //             ]
  //           },
  //           "recommendations": [
  //             "사용자가 고독함을 느낄 때, 그에게 사회적인 활동을 권장하거나, 친구나 가족과의 연락을 촉진해보세요.",
  //             "사용자의 취미나 관심사에 대해 더 많이 이야기하며, 그에게 긍정적인 감정을 유발하는 주제로 대화를 이끌어보세요."
  //           ]
  //         }
  //       }
  //     ],
  //     "averageScore": 72.5
  //   }
  // }

  return (
    <>
      <div className="calendar-schedule-date">
        <a>{selectedDate.date}</a>
      </div>

      {/* 날짜 별 집안 상태 평균 점수 표시 */}
      <div className="calendar-schedule-reports-box">
        <li className="calendar-day-status-schedules">
          <ul className="main-status-aver">
            <img
              className="calendar-widget-status-icon"
              src={thermostatImage}
              alt="temperature"
            />
            {homeStatusData[selectedDate.date]
              ? `${homeStatusData[selectedDate.date].temperature.toFixed(1)}℃`
              : "-"}
          </ul>
          <ul className="main-status-aver">
            <img
              className="calendar-widget-status-icon"
              src={humidityImage}
              alt="humidity"
            />
            {homeStatusData[selectedDate.date]
              ? `${homeStatusData[selectedDate.date].humidity.toFixed(1)}%`
              : "-"}
          </ul>
          <ul className="main-status-aver">
            <img
              className="calendar-widget-status-icon"
              src={airImage}
              alt="dust-level"
            />
            {homeStatusData[selectedDate.date]
              ? `${homeStatusData[selectedDate.date].dust_level.toFixed(
                  1
                )}㎍/㎥`
              : "-"}
          </ul>
          <ul className="main-status-aver">
            <img
              className="calendar-widget-status-icon"
              src={heatImage}
              alt="ethanol"
            />
            {homeStatusData[selectedDate.date]
              ? `${homeStatusData[selectedDate.date].ethanol.toFixed(1)}%`
              : "-"}
          </ul>
        </li>
      </div>

      <div className="calendar-schedule-reports-box">
        <div className="calendar-health-reports">
          <div className="calendar-health-reports-header">
            <img src={activityImage} alt="activity" />
            {healthData[selectedDate.date] ? (
              <h3>평균: {healthData[selectedDate.date].averageScore}</h3>
            ) : (
              <h3>-</h3>
            )}
          </div>
          {/* 해당 날짜 일정 출력 */}
          <ul>
            {healthData[selectedDate.date] ? (
              healthData[selectedDate.date].records
                .slice() // 원본 배열 변경 방지
                .reverse()
                .map((record, index) => {
                  // UTC+9 변환
                  const reportedAtKST = new Date(
                    record.reported_at
                  ).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // 24시간제
                  });

                  return (
                    <li key={index}>
                      <button>
                        <div className="health-report">
                          <span
                            className={
                              record.is_critical
                                ? "critical-score"
                                : "health-score"
                            }
                          >
                            {record.score}
                          </span>
                          <div className="health-report-header">
                            <span>{reportedAtKST}</span>{" "}
                            {/* 변환된 시간 사용 */}
                            <p>{record.action}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })
            ) : (
              <div className="no-data">기록된 활동 정보가 없습니다.</div>
            )}
          </ul>
        </div>
        <div className="calendar-mental-reports">
          <div className="calendar-mental-reports-header">
            <img src={mindfulnessImage} alt="mental" />
            {mentalData[selectedDate.date] ? (
              <h3>평균: {mentalData[selectedDate.date].averageScore}</h3>
            ) : (
              <h3>-</h3>
            )}
          </div>
          <ul>
            {/* 해당 날짜 일정 출력력 */}
            {mentalData[selectedDate.date] ? (
              mentalData[selectedDate.date].records
                .slice()
                .reverse()
                .map((record, index) => {
                  // UTC+9 변환
                  const reportedAtKST = new Date(
                    record.reported_at
                  ).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // 24시간제
                  });

                  return (
                    <li key={index}>
                      <button
                        onClick={() =>
                          handleOpenSpecificMentalReport(record.index)
                        }
                      >
                        <div className="mental-report">
                          <span
                            className={
                              record.is_critical
                                ? "critical-score"
                                : "mental-score"
                            }
                          >
                            {record.score}
                          </span>
                          <div className="mental-report-header">
                            <span>{reportedAtKST}</span>
                            <p>{record.description.overall_emotional_state}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })
            ) : (
              <div className="no-data">가록된 정신 건강 정보가 없습니다.</div>
            )}
          </ul>
        </div>
      </div>
      <MentalReportDetail />

      {/* 일정 추가 input 그룹 */}
      {/* <form onSubmit={handleSubmitSchedule} className="calendar-form">
        <input
          type="text"
          ref={inputScheduleRef}
          placeholder="Add a schedule"
        />
        <button type="submit">+</button>
      </form> */}
    </>
  );
}
