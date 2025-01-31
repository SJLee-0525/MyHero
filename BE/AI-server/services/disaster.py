import logging
from datetime import datetime
import requests
from typing import Dict, List
from sqlalchemy.orm import Session

from models import Account

logger = logging.getLogger(__name__)

class DisasterService:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def get_disaster_messages(self, user_id: str, db: Session) -> List[Dict]:
        try:
            user = db.query(Account).filter(Account.id == user_id).first()
            if not user or not user.address:
                logger.warning(f"No address found for user {user_id}")
                return []

            messages = await self._fetch_disaster_data(user.address)
            return messages
        except Exception as e:
            logger.error(f"재난문자 조회 오류: {str(e)}")
            return []

    async def _fetch_disaster_data(self, address: str) -> List[Dict]:
        try:
            url = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
            today = datetime.now().strftime("%Y%m%d")
            
            params = {
                "serviceKey": self.api_key,
                "returnType": "json",
                "pageNo": "1",
                "numOfRows": "5",
                "rgnNm": address,
                "crtDt": today
            }
            
            response = requests.get(url, params=params, verify=False)
            
            if response.status_code != 200:
                logger.error(f"Disaster API error: Status {response.status_code}")
                return []
                
            data = response.json()
            
            if data.get("response", {}).get("body", {}).get("items"):
                return data["response"]["body"]["items"]
            
            logger.info(f"No disaster messages found for address: {address}")
            return []
            
        except Exception as e:
            logger.error(f"재난문자 API 호출 오류: {str(e)}")
            return []