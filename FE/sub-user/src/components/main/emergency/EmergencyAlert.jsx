export default function EmergencyAlert({ emergencyAlert, onCheckAlert }) {
  const res = emergencyAlert.response;

  function handleCheck() {
    onCheckAlert(); // 읽음 표시
  }

  function handleReport() {
    // ... 신고 전화 걸기
    handleCheck();
  }

  function handleCall() {
    // ... 직접 전화 걸기
    handleCheck();
  }

  return (
    <div id="emergency-alert-box">
      <div>
        <div className="title-container">
          <h1 className={res ? "answer-title" : "no-answer-title"}>
            🚨 {emergencyAlert.location} 근처에서 낙상 감지
          </h1>
          <p className="date">{emergencyAlert.date}</p>
        </div>

        <div>
          <p>
            <strong>낙상 확인 여부 : </strong>
            <span className={res ? "answer" : "no-answer"}>
              {res ? <strong>오인 응답</strong> : <strong>응답 없음</strong>}
            </span>
          </p>
          {!res && (
            <p>N분 이내로 보호자 확인이 없을 시, 자동 신고가 이루어집니다</p>
          )}
          {res && <p>안전 보장을 위해, 보호자의 확인을 권고드립니다.</p>}
        </div>

        {/* 이미지 출력단 */}
        <div>
          <img src={emergencyAlert.image_url} alt="temp" />
        </div>
      </div>

      {/* 버튼 조작부 */}
      {!res && (
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
      )}
    </div>
  );
}
