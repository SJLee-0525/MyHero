## Carebot Project - Database Connector

### 개요

Carebot Project는 독거노인을 위한 스마트 생활 도우미 서비스입니다. 이 서비스는 단순한 대화 상대를 넘어, 일상 속에서 동반자가 되어주고, 긴급한 상황에서는 신속한 도움을 제공하는 역할을 합니다.

또한, Carebot은 가족 및 요양보호사가 독거노인의 생활 상태를 원격으로 모니터링할 수 있도록 지원합니다. 대화 내역을 바탕으로 감정 및 심리 상태를 분석하고, 환경 및 활동 데이터를 수집하여 위험 요소를 감지함으로써 보다 안전한 생활을 돕습니다.

이러한 서비스를 원활하게 제공하기 위해 사용자 계정 및 권한 관리, 활동 기록 저장 등의 기능이 필요하며, 이를 위해 데이터베이스와 연동된 **백엔드 서비스**를 구축하였습니다.

### 기술

<img src="https://github.com/user-attachments/assets/caac37cc-577f-4de4-8c11-22d8ada96da8"  width="100" height="100" alt="MySQL"/>

<img src="https://github.com/user-attachments/assets/f8f3d1ec-cfc2-4a02-b7cc-7ef840d7c3c6"  width="100" height="100" alt="Python"/>

<img src="https://github.com/user-attachments/assets/6564662b-0d9f-4368-b1c8-fabf22f7beb3"  width="100" height="100" alt="FastAPI"/>

| **분야** | **사용한 기술** |
| --- | --- |
| Database | **MariaDB** 10.3.23 |
| Program Language | **Python** 3.11.9 |
| Server Architecture | **FastAPI** 0.115.6 |
| DB Library | **SQL-Alchemy** 2.0.37 |

### 시스템 구조

1. **`connector.py`**
    
    Database와 **통신하기 위한 기본적인 기능**을 제공합니다.
    
    환경 변수를 통해서 host, port, user, password 등을 설정하고, **Dabase Engine을 생성**합니다.
    
    매번 요청 시에 Database를 connec(), close()를 수행하게 되면 API 처리 성능이 저하될 것으로 판단되어, Database를 연결하는 방식을 **Connection Pool**로 결정하게 되었습니다.
    
    Database 접근이 필요한 경우에는 만들어진 Engine을 통해 Database Connetion을 성립하고 Session을 생성하여 작업을 수행합니다.
    
    만약, Timeout 이내에 다시 Session을 요청하게 되는 경우는 기존에 연결된 Database Connection을 이용해 Session을 생성하여 작업을 수행하게 됩니다. Timeout 시간이 지나게 되면, 다시 Database Connection을 성립하는 과정이 먼저 수행된 후, Session을 생성하게 됩니다.
    
    ```python
    # Connection Pool 방식 SQL 연결 생성
    self.engine = create_engine(
        f"mysql+pymysql://{self.user}:"+
        f"{self.password}@{self.host}:{self.port}/"+
        f"{self.schema}?charset={self.charset}",
        pool_size=3,
        max_overflow=2,
        pool_recycle=120,
        pool_pre_ping=True,
        echo=False
    )
    
    self.pre_session = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=self.engine
    )
    
    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        # ===== code =====
    ```
    
    Database 연결은 한 군데에서만 수행되어야 Connection 개수를 관리 할 수 있기 때문에 **Database connnector**는 바로 **`connector.py`** 안에서 객체를 생성하고, 그 객체를 **전역적으로 사용**하도록 하였습니다.
    
    ```python
    database_instance = Database()
    ```
    
2. **`models.py`**
    
    Database에서 사용되는 **Table의 구조**를 정의하는 부분입니다.
    
    Database 입력 시 Enum으로 정의된 부분의 데이터 값을 검증하기 위해서 Option 값을 모두 Python Enum으로 미리 정의해두었습니다. 
    
    ```python
    class NotificationGrade(BaseEnum):
        INFO = "info"
        WARN = "warn"
        CRIT = "crit"
        NONE = "none"
    ```
    
    Foreign key에 대한 정의는 물론, Cascade 정의에 대해서 Database 설정과 **`models.py`**에 두 번 정의해두었습니다. 그리하여 ORM으로 정의된 삭제 방식과 Database 자체에서 정의된 삭제 방식이 두 번 동작하게 되며, 데이터 삭제 시 의존성 문제가 생기는 것 최대한 막을 수 있었습니다.
    
    ```python
    family_relations = relationship("FamiliesTable", cascade="all, delete")
    member_relations = relationship("MemberRelationsTable", cascade="all, delete")
    login_sessions = relationship("LoginSessionsTable", cascade="all, delete")
    message_sent = relationship("MessageTable", foreign_keys="[MessageTable.from_id]" ,cascade="all, delete")
    message_received = relationship("MessageTable", foreign_keys="[MessageTable.to_id]" ,cascade="all, delete")
    ```
    
3. **`__init__.py`**
    
    Connector와 Models를 제외한 **Database에 접근하는 기능을 Module로 정리**한 부분입니다.
    
    이 Database는 각 Table에 새로운 데이터를 쓰고, 값을 업데이트하고, 삭제하는 기능을 요구사항 단위로 function을 나누어 정의하고 있습니다.
    
4. **`accounts.py`**
    
    **사용자 계정을 생성**하고 **사용자 정보를 수정 및 삭제**하는 Database Function이 정의되어 있습니다.
    
5. **`families.py`**
    
    **가족을 구성**하고, **가족의 기본 정보를 수정 및 삭제**하는 Database Funtion이 정의되어 있습니다.
    
6. **`members.py`**
    
    **가족의 구성원을 등록하거나 나가고, 추방**하는 Database Function이 정의되어 있습니다.
    
7. **`authentication.py`**
    
    **로그인, 로그아웃, 비밀번호 수정 및 권한 확인**하는 Database Function이 정의되어 있습니다.
    
8. **`status.py`**
    
    **집 안 환경, 건강 상태, 활동 정보, 건강 상태 및 심리 상태**를 보고하고 결과를 가져오는 Database Function이 정의되어 있습니다.
    
9. **`messages.py`**
    
    **독거 노인과 보호자 간의 Message를 주고 받는** Database Funtion이 정의되어 있습니다.
    
10. **`notifications.py`**
    
    Carebot에서 발생된 **특이 사항(화재, 낙상 등)이나 공공 재난 상황을 확인**하는 Database Funtion이 정의되어 있습니다.
    
11. **`tools.py`** 
    
    그 외 **Carebot**이나 **Platform Page**에서 필요한 기능을 제공하는 Database Function이 정의되어 있습니다.
    

### 기능 정의

> **Accounts 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `get_all_email()` | 모든 사용자의 이메일 주소 불러오기 | `list[dict]` |
| 2 | `create_account(account_data)` | 새로운 사용자 계정 추가하기 | `bool` |
| 3 | `get_all_accounts()` | 모든 사용자 계정의 정보 불러오기 | `list[dict]` |
| 4 | `get_one_account(account_id)` | 사용자 계정 정보 불러오기 | `dict` |
| 5 | `get_id_from_email(email)` | 사용자 이메일을 이용해 ID 불러오기 | `str` |
| 6 | `get_hashed_password(account_id)` | DB에 저장된 사용자 비밀번호 불러오기 |  |
| 7 | `update_one_account(account_id, updated_account)` | 사용자 계정 정보 변경하기 | `bool` |
| 8 | `delete_one_account(account_id)` | 사용자 계정 삭제하기 | `bool` |

> **Families 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `main_id_to_family_id(main_id)` | 주 사용자의 ID로 가족의 ID를 불러오기 | `str` |
| 2 | `create_family(family_data)` | 새로운 가족을 추가하기 | `bool` |
| 3 | `get_all_families()` | 모든 가족 정보를 불러오기 | `list[dict]` |
| 4 | `find_family(user_name, birth_date, gender, address)` | 주 사용자의 정보를 이용해서 가족을 찾기 | `list[dict]` |
| 5 | `get_one_family(family_id)` | 가족 정보 불러오기 | `dict` |
| 6 | `update_one_family(family_id, updated_family)` | 가족 정보 변경하기 | `bool` |
| 7 | `delete_one_family(family_id)` | 가족 정보 삭제하기 | `bool` |

> **Members 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `create_member(member_data)` | 가족에 구성원을 추가하기 | `bool` |
| 2 | `get_all_members(family_id, user_id)` | 조건에 맞는 구성원 찾기 | `list[dict]` |
| 3 | `get_one_member(member_id)` | 구성원의 정보를 불러오기 | `dict` |
| 4 | `update_one_member(member_id,, updated_member)` | 구성원의 정보 변경하기 | `bool` |
| 5 | `delete_one_member(member_id)` | 가족에서 구성원 제거하기 | `bool` |

> **Authentication 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `create_session(session_data)` | 새로운 세션을 추가하기 | `bool` |
| 2 | `delete_session(session_id)` | 세션을 삭제하기 | `bool` |
| 3 | `check_current_user(request)` | 세션을 이용해 현재 사용자 검증하기 | `str` |
| 4 | `change_password(user_id, new_hashed_password)` | 사용자 계정의 비밀번호를 변경하기 | `bool` |
| 5 | `get_login_session(session_id)` | 세션 정보 가져오기 | `dict` |
| 6 | `cleanup_login_sessions()` | 만료된 세션을 정리하기 | `None` |
| 7 | `record_auto_login(session_id)` | 자동 로그인이 되도록 세션 만료 설정 | `bool` |

> **Status 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `create_home_status(home_status_data)` | 현재 집 환경 정보를 추가하기 | `bool` |
| 2 | `get_home_status(family_id, start_time, end_time, time_order)` | 조건에 맞는 집 환경 정보 불러오기 | `list[dict]` |
| 3 | `get_latest_home_status(family_id)` | 가장 최신의 집 환경 정보 불러오기 | `dict` |
| 4 | `delete_latest_home_status(family_id)` | 가장 최신의 집 환경 정보 삭제하기 | `bool` |
| 5 | `create_health_status(health_status_data)` | 현재 건강 정보를 추가하기 | `bool` |
| 6 | `get_health_status(family_id, start_time, end_time, time_order)` | 조건에 맞는 건강 정보 불러오기 | `list[dict]` |
| 7 | `get_latest_health_status(family_id)` | 가장 최신의 건강 정보 불러오기 | `dict` |
| 8 | `delete_latest_health_status(family_id)` | 가장 최신의 건강 정보 삭제하기 | `bool` |
| 9 | `create_active_status(health_status_data)` | 현재 활동 정보를 추가하기 | `bool` |
| 10 | `get_active_status(family_id, start_time, end_time, time_order)` | 조건에 맞는 활동 정보 불러오기 | `list[dict]` |
| 11 | `get_latest_health_status(family_id)` | 가장 최신의 활동 정보 불러오기 | `dict` |
| 12 | `delete_latest_health_status(family_id)` | 가장 최신의 활동 정보 삭제하기 | `bool` |
| 13 | `get_mental_status(family_id, start_time, end_time, time_order)` | 조건에 맞는 정신 건강 정보 불러오기 | `list[dict]` |
| 14 | `get_latest_mental_status(family_id)` | 가장 최신의 정신 건강 정보 불러오기 | `dict` |
| 15 | `delete_latest_mental_status(family_id)` | 가장 최신의 정신 건강 정보 삭제하기 | `bool` |
| 16 | `get_mental_reports(family_id, start_time, end_time, time_order)` | 조건에 맞는 장기 정신 건강 리포트 불러오기 | `list[dict]` |
| 17 | `get_latest_mental_reports(family_id)` | 가장 최신의 장기 정신 건강 리포트 불러오기 | `dict` |
| 18 | `delete_latest_mental_reports(family_id)` | 가장 최신의 장기 정신 건강 리포트 삭제하기 | `bool` |

> **Messages 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `create_message(message_data)` | 새로운 메시지를 추가하기 | `bool` |
| 2 | `get_new_received_messages(to_id, start_time, end_time, time_order)` | 수신한 메시지 중에서 읽지 않은 메시지 불러오기 | `list[dict]` |
| 3 | `get_all_received_messages(to_id, start_time, end_time, time_order)` | 수신한 모든 메시지 불러오기 | `list[dict]` |
| 4 | `get_all_sent_messages(from_id, start_time, end_time, time_order)` | 송신한 모든 메시지를 불러오기 | `list[dict]` |
| 5 | `get_one_message(message_id)` | 특정 메시지 내용 불러오기 | `dict` |
| 6 | `check_read_message(message_id)` | 메시지를 읽었다고 기록하기 | `bool` |
| 7 | `delete_message(message_id)` | 메시지를 삭제하기 | `bool` |

> **Notifications 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `create_notification(notification_data)` | 새로운 알림을 추가하기 | `bool` |
| 2 | `get_new_notifications(family_id, start_time, end_time, time_order)` | 수신된 알림 중에서 읽지 않은 알림 불러오기 | `list[dict]` |
| 3 | `get_all_notifications(family_id, start_time, end_time, time_order)` | 모든 알림 불러오기 | `list[dict]` |
| 4 | `get_one_notification(notification_id)` | 특정 알림 내용 불러오기 | `dict` |
| 5 | `check_read_notification(notification_id)` | 알림을 읽었다고 기록하기 | `bool` |
| 6 | `delete_notification(notification_id)` | 알림을 삭제하기 | `bool` |

> **Tools 부분**
> 

| Order | Function Name  | Description | Return |
| --- | --- | --- | --- |
| 1 | `get_all_master_region()` | 광역 자치단체 리스트 불러오기 | `list[dict]` |
| 2 | `get_all_sub_region(master_region)` | 기초 자치단체 리스트 불러오기 | `list[dict]` |
| 3 | `get_news(target_date)` | 미리 Cache된 News 불러오기 | `dict` |
| 4 | `create_settings(settings_data)` | 설정 값을 추가하기 | `bool` |
| 5 | `get_settings(family_id)` | 설정 값 불러오기 | `dict` |
| 6 | `update_settings(family_id, updated_settings)` | 설정 값 변경하기 | `bool` |
| 7 | `delete_settings(family_id)` | 설정 값 삭제하기 | `bool` |

### 변경 기록

- **[Release] `0.1.0`**
    - 기본적인 Database Connector 기능 완성
- **[Release] `0.2.0`**
    - Accounts 기능 완성
- **[Add] `0.2.1`**
    - 배포를 위한 Docker 및 Docker compose 생성
    - Develop mode와 Release mode 구별 기능 완성
- **[Fix]** **`0.2.2`**
    - 환경 변수가 적용되지 않는 문제 해결
    - DB Session이 계속 만료되는 문제 해결
- **[Add] `0.2.3`**
    - Families 기능 완성
    - Database 기능 코드 분리 완료
- **[Add] `0.2.4`**
    - Members 기능 완성
- **[Release] `0.3.0`**
    - Authentication 기능 완성
    - 사용자 정보를 이용한 검증 기능 추가
- **[Fix] `0.3.1`**
    - 사용자 정보 검증을 위한 Cookie 정책을 현재 서비스에 맞게 수정
    - 사용자 정보 검증을 위한 Cookie 정책을 현재 서비스에 맞게 수정
- **[Fix] `0.3.2`**
    - 사용자의 활동이 있을 때 만료 시간이 연장되지 않는 문제 해결
    - Accounts 접근에 권한 검증 추가
- **[Release] `0.4.0`**
    - Status 기능 완성
- **[Add] `0.4.1`**
    - AI Process 연동 기능 완성
- **[Fix] `0.4.2`**
    - 서버 시간을 사용하지 않아 발생하는 문제를 해결
    - AI Process의 처리 시간을 기다리기 위해 Timeout 시간 연장
- **[Fix] `0.4.3`**
    - 회원 가입 처리 시 주소가 같이 저장되지 않는 문제 해결
- **[Add] `0.4.4`**
    - 대한민국의 광역과 기초 자치단체 데이터를 받아올 수 있는 기능 추가
    - Client에서 받은 날짜 정보를 검증하는 방식 개선
- **[Release] `0.5.0`**
    - 주 사용자의 정보를 이용해 가족을 찾는 기능 추가
- **[Fix] `0.5.1`**
    - Log 기능을 `Print()` 대신 `Logger()`로 변경
- **[Release] `0.6.0`**
    - Notifications 기능 완성
- **[Add] `0.6.1`**
    - AI Process의 News, Weather 기능 연동
- **[Release] `0.7.0`**
    - Messages 기능 완성
- **[Add] `0.7.1`**
    - Notifications를 불러오는 부분에 시간으로 필터링하는 기능 추가
    - Database Connection overflow를 방지하기 위한 기능 추가
- **[Fix] `0.7.2`**
    - Message의 Accounts Table 외래키 관계 문제 해결
    - Database Connector가 여러 군데에서 호출되는 문제 해결
- **[Release] `0.8.0`**
    - Active Status에 Image를 추가할 수 있도록 변경
    - Message를 불러올 때 없으면 404 Not Found 대신 200 OK + 빈 리스트를 보내도록 변경
- **[Add] `0.8.1`**
    - 주 사용자가 가족에 등록된 Member를 추방할 수 있는 기능 추가
    - Notifications에 이미지를 포함할 수 있는 기능 추가
- **[Release] `0.9.0`**
    - 자동 로그인 및 Session 검증하는 기능 완성
- **[Add] `0.9.1`**
    - Family, Member 부분 권한 검증 추가
    - Status의 반환 값을 “data” → “result”가 되도록 변경
- **[Add] `0.9.2`**
    - News를 Cache된 News를 불러오도록 수정
    - Carebot의 Settings를 불러오고 변경할 수 있는 기능 완성
- **[Release] `1.0.0`**
    - 최종 버전 배포