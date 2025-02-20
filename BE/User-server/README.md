## Carebot Project - User API

### 개요

Carebot Project는 독거노인을 위한 스마트 생활 도우미 서비스입니다. 이 서비스는 단순한 대화 상대를 넘어, 일상 속에서 동반자가 되어주고, 긴급한 상황에서는 신속한 도움을 제공하는 역할을 합니다.

또한, Carebot은 가족 및 요양보호사가 독거노인의 생활 상태를 원격으로 모니터링할 수 있도록 지원합니다. 대화 내역을 바탕으로 감정 및 심리 상태를 분석하고, 환경 및 활동 데이터를 수집하여 위험 요소를 감지함으로써 보다 안전한 생활을 돕습니다.

User API Server는 사용자 정보와 가족 관리, 상태 정보 보고 및 조회, AI Chat 및 심리 상태 보고서 생성,  날씨와 뉴스 등의 부가 서비스 제공합니다. 즉, 사용자가 접근하는 **Web Platform과 Carebot 사이의 연결 다리 역할**을 수행하게 됩니다.

감정 및 심리 상태 보고서, 건강 정보와 같은 민감한 정보를 다루기 때문에 모든 서비스는 권한이 부여된 사용자만 접근할 수 있도록 Session 기반 인증으로 설계되었으며, 통신 방식도 HTTPS 프로토콜을 사용하여 Packet의 Payload에도 노출되지 않도록 하였습니다.

### 기술

<img src="/uploads/cca32fa6cf2f85bb54b812c60262d92f/Python-Dark.svg" width="100" height="100" alt="Python"/>
<img src="/uploads/3e55daa5ca0afaebcaec2f9777f4bb23/FastAPI.svg" width="100" height="100" alt="FastAPI"/>
<img src="/uploads/9e181b0d15199ae7d5b8ad673644b30b/MySQL-Dark.svg" width="100" height="100" alt="MySQL"/>

| **분야** | **사용한 기술** |
| --- | --- |
| Program Language | **Python** 3.11.9 |
| Server Architecture | **FastAPI** 0.115.6 |
| Database | **MariaDB** 10.3.23 |
| DB Library | **SQL-Alchemy** 2.0.37 |
| Validation | **Pydantic** 2.10.5 |
| Connector | **HTTPX** 0.28.1 |
| **Encryption** | **bcrypt** 4.2.1 |

### 프로젝트 구조

![최종서비스](/uploads/c224e30672147ae64917ff9bf1bd0ab6/최종서비스.png)

이 Repository는 Backend Server 구조 중에서 **API Server** 부분에 해당합니다.

```
│  docker-compose-dev.yml
│  Dockerfile
│  main.py
│  README.md
│  requirements.txt
│
├─Database
│  │  accounts.py
│  │  authentication.py
│  │  connector.py
│  │  families.py
│  │  members.py
│  │  messages.py
│  │  models.py
│  │  notifications.py
│  │  README.md
│  │  status.py
│  │  tools.py
│  └─ __init__.py
│
├─Endpoint
│  │  models.py
│  └─ README.md
│
├─External
│  │  ai.py
│  └─ README.md
│
├─Routers
│  │  accounts.py
│  │  authentication.py
│  │  chats.py
│  │  families.py
│  │  members.py
│  │  messages.py
│  │  notifications.py
│  │  README.md
│  │  status.py
│  └─ tools.py
│
└─Utilities
   │  auth_tools.py
   │  check_tools.py
   │  logging_tools.py
   └─ README.md

```

### 목적 및 기능

1. **`docker-compose-dev.yml`**
    
    배포를 위해서 필요한 **Docker Container의 설정 정보가 포함**된 Docker Compose 정보입니다.
    
2. **`Dockerfile`**
    
    배포할 이미지에 대한 **기본 이미지와 파일들에 대한 정의가 포함**된 Docker 정보입니다.
    
3. **`main.py`**
    
    User API Server를 구성하는 **FastAPI와 CORS 설정, Router 설정**이 포함되어 있습니다.
    
4. **`requirements.txt`**
    
    해당 서비스를 수행하기 위해 설치해야 하는 Python Library의 종류와 버전이 기록된 문서입니다.
    
    아래는 필수적으로 설치해야 하는 Library의 목록과 기능, 버전에 대한 설명입니다.
    
    | Library | Description | Version |
    | --- | --- | --- |
    | **`fastapi`** | API & Web Framework | `0.115.6` |
    | **`uvicorn`** | ASGI web server | `0.34.0` |
    | **`PyMySQL`** | MySQL Library | `1.1.1` |
    | **`SQLAlchemy`** | SQL Toolkit and ORM | `2.0.37` |
    | **`python-detenv`** | Python Environment Library | `1.0.1` |
    | **`pydantic`** | Data Validation Library | `2.10.5` |
    | **`httpx`** | Python HTTP Client | `0.28.1` |
5. **`Database`**
    
    Database와 연결하여 **정보를 생성하고 수정, 삭제하는 기능**이 포함된  Library입니다.
    
6. **`Endpoint`**
    
    Client에서 보내는 요청에 담긴 **Body 내용을 사전에 정의한 객체**가 포함되어 있습니다.
    
7. **`External`**
    
    AI Process Server와 연계하여 **AI 기반의 서비스**를 제공하는 기능이 포함되어 있습니다.
    
8. **`Routers`**
    
    Client에서 사용될 **모든 API의 기능**이 포함되어 있습니다.
    
9. **`Utilities`**
    
    Database나 Routers에 **사용되는 도구**들이 정의되어 있습니다.