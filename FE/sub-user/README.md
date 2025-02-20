# 프로젝트 이름

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.5-purple?logo=vite)
![ESLint](https://img.shields.io/badge/ESLint-9.17.0-blueviolet?logo=eslint)
![React Router](https://img.shields.io/badge/React_Router-7.1.2-red?logo=reactrouter)
![Recharts](https://img.shields.io/badge/Recharts-2.15.0-orange?logo=recharts)

## 개요

Carebot Project는 독거노인을 위한 스마트 생활 도우미 서비스입니다.
단순한 대화 상대를 넘어 일상 속 동반자 역할을 하며, 긴급한 상황에서는 신속한 도움을 제공합니다.

또한, Carebot은 가족 및 요양보호사가 독거노인의 생활 상태를 원격으로 모니터링할 수 있도록 지원합니다.

대화 내역을 바탕으로 감정 및 심리 상태를 분석하고, 환경 및 활동 데이터를 수집하여 위험 요소를 감지함으로써 보다 안전한 생활을 돕습니다.

### 📱 보조 사용자 페이지 (Sub-User Page)

보조 사용자 페이지는 언제 어디서나 접근이 용이하도록 반응형 웹으로 제작되었습니다.

- 데스크톱과 모바일 환경 모두 최적화하여 Carebot 서비스를 원활하게 이용할 수 있습니다.

- 앱과 유사한 경험을 제공하기 위해 페이지 이동을 최소화하고, 모달 위주의 UI 구성과 좌측 네비게이션 바 배치를 통해 직관적인 사용자 경험을 제공합니다.

## 🛠 기술 스택

- **Frontend**: React (18.3.1), Vite (6.0.5)
- **UI 라이브러리**: GSAP (애니메이션), Pretendard (폰트)
- **차트**: Recharts (2.15.0)
- **라우팅**: React Router (7.1.2)
- **상태 관리**: React Context API (Redux 등 별도 라이브러리 없이 Provider 기반 상태 관리)
- **API 요청**: Fetch API
- **QR 코드**: qrcode.react (4.2.0)
- **날짜 처리**: date-fns (4.1.0)
- **정적 코드 분석**: ESLint (9.17.0), eslint-plugin-react, eslint-plugin-react-hooks
- **개발 도구**: Vite, @vitejs/plugin-react

## 📂 프로젝트 구조

```plaintext
📦 프로젝트 루트
 ┣ 📂 src
 ┃ ┣ 📂 components          # 재사용 가능한 컴포넌트
 ┃ ┃ ┣ 📂 modal             # 모달 컴포넌트
 ┃ ┃ ┣ 📂 nav               # 네비게이션 바
 ┃ ┃ ┣ 📂 spinner           # 스피너
 ┃ ┃ ┣ 📂 widget            # 위젯 컴포넌트
 ┃ ┃ ┣ 📂 toggle            # 토글 컴포넌트
 ┃ ┃ ┗ 📂 main              # 메인 컴포넌트
 ┃ ┃   ┣ 📂 accounts        # 계정 관련
 ┃ ┃   ┣ 📂 activity        # 활동 관련
 ┃ ┃   ┣ 📂 advertisement   # 비로그인 상태 관련
 ┃ ┃   ┣ 📂 calendar        # 달력 관련
 ┃ ┃   ┣ 📂 container       # 페이지 컨테이너 관련
 ┃ ┃   ┣ 📂 emergency       # 긴급 알람 관련
 ┃ ┃   ┣ 📂 home            # 홈 화면 관련
 ┃ ┃   ┣ 📂 mental          # 정신 건강 관련
 ┃ ┃   ┣ 📂 message         # 메시지 관련
 ┃ ┃   ┣ 📂 notification    # 알림 관련
 ┃ ┃   ┗ 📂 settings        # 설정 관련
 ┃ ┣ 📂 pages               # 페이지 단위 컴포넌트
 ┃ ┣ 📂 hooks               # 커스텀 훅
 ┃ ┣ 📂 store               # 저장소
 ┃ ┃ ┣ 📜 calendarStore.jsx     # 캘린더 관련 저장소
 ┃ ┃ ┣ 📜 effectStore.jsx       # 의존성 관련 useEffect 처리
 ┃ ┃ ┣ 📜 emergencyStore.jsx    # 긴급 알림 관련 저장소
 ┃ ┃ ┣ 📜 environmentsStore.jsx # 환경 변수 관련
 ┃ ┃ ┣ 📜 healthStore.jsx       # 건강 정보 관련 저장소
 ┃ ┃ ┣ 📜 homeStatusStore.jsx   # 집 안 상태 관련 저장소
 ┃ ┃ ┣ 📜 messageStore.jsx      # 메시지 관련 저장소
 ┃ ┃ ┗ 📜 userProgressStore.jsx # account, 사용자 조작 관련 저장소
 ┃ ┣ 📂 assets          # 이미지, 폰트 등 정적 파일
 ┃ ┣ 📜 App.jsx         # 메인 App 컴포넌트
 ┃ ┣ 📜 main.jsx        # 진입점
 ┗ 📜 README.md
```

## 📄 페이지 구성

### 🏠 홈 화면

![HOME]()

- 전체 알림 확인 가능
- 캘린더 위젯을 통해 대략적인 활동 확인 가능
- 토글을 통해 영웅이의 작동 상태 및 집 내부 모니터링 정보 확인 가능

![MOBILE_HOME]()

- 반응형 디자인을 통해 모바일 환경에서도 편리하게 이용 가능

### 🔔 알림 페이지

![NOTIFICATIONS]()

- 모든 알림을 한 곳에서 확인 가능
- 좌측 부터 일반 알림, 재난 문자 알림, 긴급 알림 순으로 구분
- 읽지 않은 알림의 경우 클릭함으로써 읽음 처리 가능
- 하단의 버튼을 통해 지난 기록 확인이 가능

![PAST_NOTIFICATIONS]()

- 지난 알림 기록 확인 가능
- 기간을 설정하여 특정 기간 동안의 알림 확인 가능

![EMERGENCY_NOTIFICATIONS]()

- 긴급한 알림(낙상, 화재 등)이 발생할 시, 모달을 통해 정보 제공
- 읽음 표시하기 전까지 계속해서 알림을 띄움
- 전화하기 버튼을 눌러서 전화 어플로 연결 가능
- 메시지 보내기 버튼을 눌러서 메시지 페이지로 이동 가능

![NORMAL_NOTIFICATIONS]()

- 긴급한 알림이 아닌 경우 (일반 알림, 재난 알림 등)에는 우측 하단에, 알림을 띄워주는 모달 생성
- 읽음 표시하기 전까지 계속해서 알림을 띄움
- 알림을 클릭해 읽음 표시 가능

### 💬 메시지 페이지

![MESSAGES]()

- 등록된 가족들과 채팅이 가능
- 메시지를 보내면 영웅이가 TTS로 메시지를 읽어 줌
- 사진 첨부가 가능함

### 📅 캘린더 페이지

![CALENDAR]()

- 지난 날짜의 정보들을 확인 가능
- 해당 날짜에 측정된 온도, 습도, 미세먼지, 일산화탄소 농도의 평균 값을 확인 가능
- 해당 날짜에 측정된 활동 점수와 대화 리포트 점수의 평균 확인 가능
- 해당 날짜에 기록된 대화 리포트 기록을 확인 가능

### 🏃 건강 페이지

![HEALTH]()

- 활동 및 정신 건강 상태를 모니터링하고 기록
- 지난 7일 간 활동량과 감정 변화 추이 확인 가능
- 대화 기반 감정 분석 결과 확인 가능
- 특정 기간 동안의 정신 건강 분석 리포트 제공

![EMOTION_REPORT]()

- 대화 기반 감정 분석 결과 확인 가능

![MENTAL_REPORT]()

- 정신 건강 분석 리포트 확인 가능
- DB에 따로 저장되지 않음
- 출력 버튼을 눌러서 PDF 파일로 저장 및 인쇄가 가능

### ⚙️ 계정 페이지

- 계정 정보 확인 및 수정 가능
- 비밀번호 변경 가능
- 계정 탈퇴 가능
- 로그아웃 가능

![USER_ACCOUNT]()

- 자신이 가입된 가족 모임 정보 확인 가능
- 가족 모임에 등록된 닉네임 변경 가능
- 가족 모임에서 탈퇴 가능

![FAMILY_ACCOUNT]()

- 가족 모임에 등록된 가족들의 정보 확인 가능
- 해당 가족 모임에 가입하는데 필요한 QR 코드 확인 가능
- 가족 모임 삭제 가능
- 가족 모임에 등록된 보조 사용자 추방 가능

![QR_REGISTER]()

- QR 코드를 스캔하여 가족 모임에 가입 가능

## 연결한 API

| #   | 기능 설명                                  | 메서드 | 엔드포인트                                        |
| --- | ------------------------------------------ | ------ | ------------------------------------------------- |
| 1   | 이메일 중복 확인                           | POST   | /accounts/check-email                             |
| 2   | Account 생성                               | POST   | /accounts                                         |
| 3   | Account 불러오기                           | GET    | /accounts/:user-id                                |
| 4   | Account 정보 업데이트                      | PATCH  | /accounts/:user-id                                |
| 5   | Account 삭제하기                           | DELETE | /accounts/:user-id                                |
| 6   | Main ID로 Family ID 확인                   | POST   | /families/check-exist                             |
| 7   | Family 생성                                | POST   | /families                                         |
| 8   | Family 불러오기                            | GET    | /families/:family-id                              |
| 9   | Family 정보 업데이트                       | PATCH  | /families/:family-id                              |
| 10  | Family 삭제하기                            | DELETE | /families/:family-id                              |
| 11  | Member 추가하기                            | POST   | /members                                          |
| 12  | Member 불러오기                            | GET    | /members/:member-id                               |
| 13  | Member 정보 업데이트하기                   | PATCH  | /members/:member-id                               |
| 14  | Member 삭제하기                            | DELETE | /members/:member-id                               |
| 15  | Login                                      | POST   | /auth/login                                       |
| 16  | Logout                                     | POST   | /auth/logout                                      |
| 17  | Account 비밀번호 변경                      | PATCH  | /auth/change-password                             |
| 18  | 집 환경 정보 불러오기                      | GET    | /status/home/:family-id?start&end&order           |
| 19  | 최신 집 환경 정보 불러오기                 | GET    | /status/home/latest/:family-id                    |
| 20  | 건강 정보 불러오기                         | GET    | /status/health/:family-id?start&end&order         |
| 21  | 활동 정보 불러오기                         | GET    | /status/active/:family-id?start&end&order         |
| 22  | 단일 정신 건강 정보 불러오기               | GET    | /status/mental/:family-id?start&end&order         |
| 23  | 장기 정신 건강 보고서 불러오기             | GET    | /status/mental-reports/:family-id?start&end&order |
| 24  | 주 사용자의 정보로 가족을 검색하는 기능    | POST   | /families/find                                    |
| 25  | 이미지를 업로드하는 기능                   | POST   | https://image.itdice.net/upload                   |
| 26  | 메시지를 보낼 수 있는 대상을 확인하는 기능 | GET    | /messages/receivable/:user-id                     |
| 27  | 메시지를 보내는 기능                       | POST   | /messages/send                                    |
| 28  | 받은 모든 메시지를 확인하는 기능           | GET    | /messages/all?start&end&order                     |
| 29  | 보낸 모든 메시지를 확인하는 기능           | GET    | /messages/sent?start&end&ordr                     |
| 30  | 새롭게 받은 알림을 확인하는 기능           | GET    | /notify/new?start&end&order                       |
| 31  | 받은 모든 알림을 확인하는 기능             | GET    | /notify/all?start&end&order                       |
| 32  | 알림을 읽음 표시하는 기능                  | PATCH  | /notify/read/:index                               |
| 33  | 주 사용자가 등록된 가족을 추방             | DELETE | /members/kick/:member-id                          |
| 34  | 자동로그인 설정                            | PATCH  | /auth/auto-login                                  |
| 35  | 현재 Session 유효 확인                     | GET    | /auth/check                                       |
| 36  | Settings 값 불러오기                       | GET    | /tools/settings/:family-id                        |
| 37  | Settings 값 업데이트                       | PATCH  | /tools/settings/:family-id                        |
| 38  | Family 유효 확인 및 이름 가져오기          | GET    | /families/name/:family-id                         |
