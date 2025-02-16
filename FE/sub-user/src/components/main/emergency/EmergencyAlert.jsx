export default function EmergencyAlert({ emergencyAlert, onCheckAlert }) {
  const createdAtKST = new Date(emergencyAlert.created_at + "Z").toLocaleString(
    "ko-KR",
    {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 24시간제
    }
  );

  return (
    <div
      id={
        emergencyAlert.is_read
          ? "emergency-alert-box-checked"
          : "emergency-alert-box"
      }
    >
      <div>
        <div className="title-container">
          <h2>{emergencyAlert.description}</h2>
          <p className="date">{createdAtKST}</p>
        </div>

        {/* 이미지 출력단 */}
        <div className="emergency-image-container">
          <img src={emergencyAlert.image_url} alt="temp" />
        </div>
      </div>

      {/* 버튼 조작부 */}
      {/* {!res && (
        <div className="button-container">
          <button className="report" onClick={handleReport}>
            신고 요청 보내기
          </button>
          <button className="call" onClick={handleCall}>
            전화 연결
          </button>
        </div>
      )}
      {res && (
        <div className="button-container">
          <button className="call" onClick={handleCall}>
            전화 연결
          </button>
          <button className="close" onClick={handleCheck}>
            닫기
          </button>
        </div>
      )} */}
    </div>
  );
}
