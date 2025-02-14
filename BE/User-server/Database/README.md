## Carebot Project - Database Connector

### 개요

Carebot Project는 독거노인을 위한 스마트 생활 도우미 서비스입니다. 이 서비스는 단순한 대화 상대를 넘어, 일상 속에서 동반자가 되어주고, 긴급한 상황에서는 신속한 도움을 제공하는 역할을 합니다.

또한, Carebot은 가족 및 요양보호사가 독거노인의 생활 상태를 원격으로 모니터링할 수 있도록 지원합니다. 대화 내역을 바탕으로 감정 및 심리 상태를 분석하고, 환경 및 활동 데이터를 수집하여 위험 요소를 감지함으로써 보다 안전한 생활을 돕습니다.

이러한 서비스를 원활하게 제공하기 위해 사용자 계정 및 권한 관리, 활동 기록 저장 등의 기능이 필요하며, 이를 위해 데이터베이스와 연동된 **백엔드 서비스**를 구축하였습니다.

### 기술

<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 256 256">
<rect width="256" height="256" fill="#F4F2ED" rx="60"/>
<g clip-path="url(#clip0_7_150)"><path fill="#00678C" fill-rule="evenodd" d="M203.801 178.21C194.011 177.938 186.416 178.941 180.051 181.619C178.218 182.355 175.277 182.355 175.035 184.662C176.015 185.63 176.133 187.214 176.992 188.556C178.459 190.991 181.033 194.271 183.357 195.973L191.191 201.571C195.965 204.488 201.351 206.193 206.002 209.113C208.696 210.817 211.388 213.007 214.082 214.834C215.454 215.807 216.285 217.392 218 217.997V217.629C217.144 216.538 216.897 214.957 216.044 213.735L212.367 210.209C208.82 205.465 204.41 201.325 199.636 197.922C195.718 195.245 187.152 191.596 185.56 187.097L185.319 186.824C188.008 186.552 191.191 185.605 193.764 184.875C197.929 183.784 201.721 184.024 206.002 182.93L211.882 181.226V180.135C209.678 177.946 208.087 175.025 205.763 172.959C199.521 167.606 192.661 162.373 185.56 157.994C181.766 155.562 176.868 153.977 172.829 151.913C171.356 151.182 168.911 150.817 168.055 149.601C165.846 146.929 164.625 143.397 163.034 140.232L152.997 119.064C150.794 114.319 149.444 109.574 146.755 105.195C134.144 84.5124 120.431 71.9828 99.375 59.6932C94.8477 57.1382 89.4616 56.0393 83.7353 54.7032L74.5546 54.2124C72.5928 53.3616 70.6364 51.0493 68.9216 49.9531C61.9441 45.5739 43.9475 36.0847 38.8029 48.5897C35.4966 56.4974 43.7006 64.2824 46.4855 68.299C48.5708 71.0966 51.2597 74.2597 52.7332 77.4228C53.5563 79.4897 53.8307 81.682 54.6895 83.8717C56.6458 89.2243 58.4842 95.1878 61.0551 100.178C62.427 102.733 63.8675 105.413 65.5824 107.723C66.5619 109.086 68.2768 109.67 68.6417 111.859C66.9268 114.294 66.8089 117.94 65.8293 120.986C61.42 134.734 63.1349 151.766 69.377 161.888C71.3389 164.928 75.9622 171.622 82.2345 169.065C87.744 166.875 86.5148 159.941 88.1062 153.857C88.4766 152.399 88.2297 151.425 88.9623 150.449V150.722L93.9834 160.819C97.7781 166.78 104.391 172.986 109.897 177.125C112.833 179.315 115.16 183.089 118.831 184.425V184.057H118.59C117.854 182.966 116.751 182.475 115.772 181.624C113.569 179.435 111.121 176.757 109.406 174.325C104.267 167.513 99.7399 159.968 95.6983 152.183C93.7365 148.412 92.0216 144.275 90.4357 140.504C89.6949 139.043 89.6949 136.85 88.4739 136.125C86.6355 138.797 83.9466 141.115 82.5939 144.398C80.2672 149.628 80.0257 156.077 79.1697 162.769C78.6758 162.891 78.8953 162.769 78.6758 163.041C74.7631 162.071 73.4132 158.051 71.9453 154.648C68.274 146.01 67.6594 132.141 70.8422 122.164C71.6983 119.609 75.375 111.579 73.9071 109.146C73.1662 106.834 70.7242 105.498 69.3743 103.671C67.7829 101.359 66.0735 98.4409 64.9705 95.8859C62.0346 89.0689 60.5667 81.5293 57.3812 74.7151C55.9077 71.552 53.3396 68.2662 51.257 65.3486C48.9303 62.0628 46.3648 59.7505 44.5265 55.8593C43.9146 54.4959 43.0585 52.3309 44.0381 50.8693C44.2795 49.8959 44.7734 49.5059 45.7475 49.2878C47.3389 47.9244 51.8716 49.6532 53.463 50.3785C57.9903 52.2054 61.7849 53.907 65.5796 56.4592C67.2945 57.6754 69.1329 59.9877 71.3361 60.5985H73.9098C77.8279 61.4493 82.2317 60.8712 85.9002 61.9619C92.3893 64.0343 98.2637 67.0719 103.532 70.3604C119.567 80.4577 132.792 94.8143 141.725 111.971C143.193 114.769 143.805 117.324 145.155 120.244C147.729 126.208 150.912 132.289 153.477 138.132C156.051 143.85 158.498 149.694 162.17 154.438C164.008 156.993 171.35 158.329 174.654 159.668C177.104 160.759 180.896 161.741 183.105 163.077C187.264 165.632 191.427 168.552 195.342 171.35C197.298 172.806 203.423 175.849 203.787 178.276L203.801 178.21ZM78.9584 72.4873C77.267 72.4724 75.5809 72.6769 73.9427 73.0954V73.3681H74.1842C75.1637 75.315 76.8786 76.6538 78.1023 78.3581L80.9202 84.1989L81.1616 83.9262C82.8765 82.71 83.7353 80.7631 83.7353 77.8454C83 76.9947 82.8793 76.1412 82.2674 75.2904C81.5321 74.0743 79.9407 73.4635 78.9584 72.4928V72.4873Z" clip-rule="evenodd"/></g><defs><clipPath id="clip0_7_150"><rect width="180" height="180" fill="#fff" transform="translate(38 38)"/></clipPath></defs>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 256 256">
<rect width="256" height="256" fill="#F4F2ED" rx="60"/>
<path fill="url(#paint0_linear_2_56)" d="M127.279 29C76.5066 29 79.6772 51.018 79.6772 51.018L79.7338 73.8284H128.185V80.6772H60.4893C60.4893 80.6772 28 76.9926 28 128.222C28 179.452 56.3573 177.636 56.3573 177.636H73.2812V153.863C73.2812 153.863 72.369 125.506 101.186 125.506H149.24C149.24 125.506 176.239 125.942 176.239 99.4123V55.5461C176.239 55.5461 180.338 29 127.279 29ZM100.563 44.339C105.384 44.339 109.28 48.2351 109.28 53.0556C109.28 57.8761 105.384 61.7723 100.563 61.7723C95.7426 61.7723 91.8465 57.8761 91.8465 53.0556C91.8465 48.2351 95.7426 44.339 100.563 44.339Z"/><path fill="url(#paint1_linear_2_56)" d="M128.721 227.958C179.493 227.958 176.323 205.941 176.323 205.941L176.266 183.13H127.815V176.281H195.511C195.511 176.281 228 179.966 228 128.736C228 77.5062 199.643 79.323 199.643 79.323H182.719V103.096C182.719 103.096 183.631 131.453 154.814 131.453H106.76C106.76 131.453 79.7607 131.016 79.7607 157.546V201.412C79.7607 201.412 75.6615 227.958 128.721 227.958ZM155.437 212.619C150.616 212.619 146.72 208.723 146.72 203.903C146.72 199.082 150.616 195.186 155.437 195.186C160.257 195.186 164.154 199.082 164.154 203.903C164.154 208.723 160.257 212.619 155.437 212.619Z"/><defs><linearGradient id="paint0_linear_2_56" x1="47.22" x2="146.333" y1="46.896" y2="145.02" gradientUnits="userSpaceOnUse"><stop stop-color="#387EB8"/><stop offset="1" stop-color="#366994"/></linearGradient><linearGradient id="paint1_linear_2_56" x1="108.056" x2="214.492" y1="109.905" y2="210.522" gradientUnits="userSpaceOnUse"><stop stop-color="#FFE052"/><stop offset="1" stop-color="#FFC331"/></linearGradient></defs>
</svg>

<svg width="100" height="100" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="256" height="256" rx="60" fill="#049789"/>
<path d="M127.5 41C79.743 41 41 79.743 41 127.5C41 175.257 79.743 214 127.5 214C175.257 214 214 175.257 214 127.5C214 79.743 175.257 41 127.5 41ZM122.993 196.839V142.581H92.8306L136.167 58.1615V112.419H165.203L122.993 196.839Z" fill="white"/>
</svg>

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