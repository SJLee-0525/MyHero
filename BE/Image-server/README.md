## Carebot Project - Image Provider

### 개요

Carebot Project는 독거노인을 위한 스마트 생활 도우미 서비스입니다. 이 서비스는 단순한 대화 상대를 넘어, 일상 속에서 동반자가 되어주고, 긴급한 상황에서는 신속한 도움을 제공하는 역할을 합니다.

또한, Carebot은 가족 및 요양보호사가 독거노인의 생활 상태를 원격으로 모니터링할 수 있도록 지원합니다. 대화 내역을 바탕으로 감정 및 심리 상태를 분석하고, 환경 및 활동 데이터를 수집하여 위험 요소를 감지함으로써 보다 안전한 생활을 돕습니다.

화재가 발생하거나 낙상이 발생했을 때, Carebot에서 이미지를 캡쳐해서 보호자에게 전송하여 현재 상태를 보고하는 기능이 존재합니다. 단순히 상황 정보를 제공하는 것 보다, 이미지와 제공하게 되면서 현재 상태를 정확히 파악하고 시스템 오류로 잘못 판단된 경고를 필터링 할 수 있게 됩니다.

추가적으로 사용자 간의 이미지를 주고 받으면서 가족 간의 안부를 묻고 기분 좋은 상황을 공유하는 기능을 제공하고자 합니다. 그러기 위해선 **이미지를 업로드하고 접근하며, 삭제하는 기능을 수행하는 서비스를 개발**해야 합니다.

### 기술

| **분야** | **사용한 기술** |
| --- | --- |
| Database | **MariaDB** 10.3.23 |
| Program Language | **Python** 3.11.9 |
| Server Architecture | **FastAPI** 0.115.6 |
| Cached Point | **Nginx** 1.18.0 |
| DB Library | **SQL-Alchemy** 2.0.37 |

### 프로젝트 구조

![최종서비스](/uploads/c224e30672147ae64917ff9bf1bd0ab6/최종서비스.png)

이 Repository는 Backend Server 구조 중에서 **Image Server** 부분에 해당합니다.

### 시스템 구조

1. **`Database`**
    
    접근하는 로그인 Session 정보를 확인하고 유효한 접근인지 검증하기 위해 Database의 접근이 필수적입니다. 이 Library는 Carebot Project의 **Database를 접근하기 위한 기능이 포함**되어 있습니다.
    
    상세한 내용은 Database Connector README.md를 참고해주세요.
    
2. **`Utilites`**
    
    Database에 저장되어 있는 ID 값을 감지하고, Server Debugging을 원활하게 하기 위해서 Log를 재정의하는 기능이 포함되어 있습니다.
    
    상세한 내용은 Utilities README.md를 참고해주세요.
    
3. **`docker-compose.yml`**
    
    배포를 위해서 필요한 **Docker Container의 설정 정보가 포함**된 Docker Compose 정보입니다.
    
4. **`Dockerfile`**
    
    배포할 이미지에 대한 **기본 이미지와 파일들에 대한 정의가 포함**된 Docker 정보입니다.
    
5. **`requirements.txt`**
    
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
    | **`filetype`** | MIME Type Checking Library | `1.2.0` |
    | **`python-multipart`**  | Streaming Multipart Parser | `0.0.20` |
6. **`main.py`**
    
    Image Provider에 대한 **모든 기능(Verify, Upload, Provide, Delete)**이 포함되어 있습니다. 
    
    파일의 크기와 파일 종류에 대한 제한, Cache 기간에 대한 설정이 되어 있습니다.
    
    ```python
    checker_size: int = 2048
    allowed_types: list[str] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    max_image_size: int = int(os.getenv("MAX_IMAGE_SIZE")) * 1024 * 1024
    cache_duration: int = int(os.getenv("CACHE_DURATION"))
    ```
    
    제3자가 링크를 완벽히 알고 있더라도 로그인 없이는 이미지에 대한 접근을 막기 위해 Nginx가 전달하지 않고 **직접 FastAPI Framework에서 전달하도록 설계**하였습니다. 이미지 링크에 접근하게 되면 요청자의 Session 값을 검증하고, 그 요청자가 해당 이미지에 접근 가능한 사용자인지 확인하는 과정을 거치게 됩니다.
    
    ```python
    # 사용자 계정을 통해 접근하는지 확인
    request_data: dict = Database.get_one_account(request_id)
    
    if not request_data:
        logger.warning(f"Can not access image: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )
    
    # 접근 권한 범위 설정
    accessible_id: list[str] = [request_id]
    
    if request_data["role"] == Role.MAIN:  # 주 사용자가 접근한 경우 소속된 가족 이미지까지 접근 가능
        family_id: str = Database.main_id_to_family_id(request_id)
        member_data: list[dict] = Database.get_all_members(family_id=family_id)
        for member in member_data:
           accessible_id.append(member["user_id"])
    elif request_data["role"] == Role.SUB:  # 보조 사용자가 접근한 경우 소속된 주 사용자들의 이미지까지 접근 가능
        member_data: list[dict] = Database.get_all_members(user_id=request_id)
        family_id_list: list[str] = [member["family_id"] for member in member_data]
        for family_id in family_id_list:
            family_data: dict = Database.get_one_family(family_id)
            accessible_id.append(family_data["main_user"])
    
    # 요청한 사용자가 해당 이미지 경로에 접근 가능한지 점검
    if request_data["role"] != Role.SYSTEM and user_id not in accessible_id:
        logger.warning(f"Can not access image: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )
    ```
    
    해당 서비스는 이미지를 관리하는 서버이기 때문에 다른 종류의 파일이 업로드되는 예외 상황을 방지해야 합니다. 그래서 파일 맨 앞의 Binary를 읽어서 실제 파일의 형식을 읽어 종류를 파악하도록 설계하였습니다. 이를 통해 **확장자 이름을 변조한 경우에도 파일 형식을 정확히 파악**하여 의도에 벗어난 파일이 Server에 업로드 되는 경우를 최대한 방지합니다.
    
    ```python
    # 파일 내용 검사
        file_bytes = await file.read(checker_size)
        file_type = filetype.guess(file_bytes)
    
        if file_type is None or file_type.mime not in allowed_types:
            logger.warning(f"Invalid file type: {file_type.mime if file_type else 'unknown'}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "type": "invalid value",
                    "message": "Only image files can be uploaded",
                    "input":{
                        "request_id": request_id,
                        "file_name": file.filename,
                        "file_type": file_type.mime if file_type else 'unknown'
                    }
                }
            )
    ```
    

### 기능 정의

1. **Image Upload**
    > 🔐 **[접근 권한이 존재합니다]** \
    사용자 계정이 존재해야 합니다.

    > 🌐 **POST `https://image.itdice.net/upload`**
    
    - Parameter

        | - | - | - |
        | --- | --- | --- |
    - Body - formdata
        
        | **`file`** | 이미지 데이터 **[필수]** | `File` |
        | --- | --- | --- |
        
2. **Image Access**
    > 🔐 **[접근 권한이 존재합니다]** \
    로그인 된 사용자가 해당 이미지 소유자와 **같은 Family** 이어야 합니다. \
    *관리자(System)을 제외한 모든 사용자에게 적용됨*

    > 🌐 **GET `https://image.itdice.net/access/:user-id/:file-name`**
    
    - Parameter

        | **`user-id`** | 이미지의 소유자 ID **[필수]** | `String` |
        | --- | --- | --- |
        | **`file-name`** | 이미지의 파일명 **[필수]** | `String` |
    - Body - formdata

        |  |  |  |
        | --- | --- | --- |
        
3. **Image Delete**
    > 🔐 **[접근 권한이 존재합니다]** \
    로그인 된 **사용자의 ID**와 **이미지의 소유자**가 같아야 합니다. \
    *관리자(System)을 제외한 모든 사용자에게 적용됨*

    > 🌐 **DELETE `https://image.itdice.net/delete/:user-id/:file-name`**
    
    - Parameter

        | **`user-id`** | 이미지의 소유자 ID **[필수]** | `String` |
        | --- | --- | --- |
        | **`file-name`** | 이미지의 파일명 **[필수]** | `String` |
    - Body - formdata

        |  |  |  |
        | --- | --- | --- |