import React, { useEffect, useState, useRef } from 'react';
import QrScanner from 'qr-scanner'; // qr-scanner 라이브러리 임폴트
 
export default React.memo(function Qrcode(props) {
  // qrError은 QR을 스캔할 카메라가 없거나 카메라 사용이 허가되지 않은 경우(에러)에 대한 useState훅이다.
  // qrError의 기본값은 false이고 QR 스캔이 불가능한 상태는 true이다.
  const [qrError, setQrError] = useState(false);
 
  // 스캔한 QR의 URL이 http 또는 https로 시작하는지 확인(리턴값 boolean)
  const isUrl = text => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };
 
  // QR 코드 스캔 결과 처리
  const handleScan = data => {
    if (data) {
      if (isUrl(data.data)) {
        window.open(data.data);
      } else {
        // http 키워드가 없는 QR의 경우 http://를 붙여줌
        window.open(`http://${data.data}`);
      }
    }
  };
 
  const QrOptions = {
    // 핸드폰의 경우 외부 카메라, 셀프 카메라 여부
    preferredCamera: 'environment',
    // 1초에 5번 QR 코드 감지한다.
    maxScansPerSecond: 5,
    // 노란색 사각 영역을 표시하고 그 안에서 QR스캔이 가능하다.
    highlightScanRegion: true,
  };
 
  // <video> 돔에 qr-scanner를 적용하기 위한 useRef 훅
  const videoRef = useRef(null);
 
  // QrScanner 라이브러리 사용
  useEffect(() => {
    // QrScanner.hasCamera()로 장치에 카메라가 있는지 확인
    QrScanner.hasCamera().then(hasCamera => {
      if (!hasCamera) {
        setQrError(true);
      }
      if (hasCamera) {
        const videoElem = videoRef.current;
        if (videoElem) {
          const qrScanner = new QrScanner(
            videoElem,
            result => {
              console.log('result : ', result);
              handleScan(result);
            },
            QrOptions,
          );
          // 카메라 사용이 허가되었는지 확인
          qrScanner.start().catch(e => setQrError(true));
 
          return () => qrScanner.destroy();
        }
      }
    });
  }, []);
 
  return (
    <main id="qrcode">
      {/* QR 스캔 카메라 작동할 경우 */}
      {!qrError && (
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          ref={videoRef}
        />
      )}
      {/* QR 스캔 카메라 작동 안될 경우 */}
      {qrError && (
        <div className="no-qr">
          <p>실행할 수 없음</p>
          <small>
            카메라가 작동하지 않는다면 기기의
            <br />
            카메라(QR리더기)를 직접 작동시켜 주세요.
          </small>
        </div>
      )}
    </main>
  );
});