# Speech-To-Text (Google Cloud Platform API 사용)
---

## 코드 실행 방법

현재 몇몇 설정값들은 하드코딩되어있음.  
코드 상단의 상수값들을 변경하거나, `json` 혹은 `args` 형태로 부여 가능.  
추후 수정 예정

```bash
python STTmain.py
```

## 코드 동작

프로그램 시작 -> `config.json` 확인 후 없으면 기본 설정값 사용 -> Google Cloud 클라이언트 인증 -> 각 클래스 초기화 -> 음성 인식 시작(실시간 스트리밍)  

> `logs` 폴더에 로깅

### 조건

- 프로그램 하이퍼 파라미터 중 `Keyword`가 있으며, 이 키워드가 인식되면 `recorded_text`로 음성 기록  
- `종료` 음성 인식 시 `recorded_text`의 내용을 텍스트 파일로 저장하고 프로그램 종료  
