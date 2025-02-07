import logging
from datetime import datetime
import requests
from typing import Dict, List
from sqlalchemy.orm import Session
import json

from models import Account, Family, Notification

logger = logging.getLogger(__name__)

class DisasterService:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def update_disaster_notifications(self, db: Session) -> None:
        try:
            # 모든 unique한 주소 가져오기
            addresses = db.query(Account.address).distinct().all()
            # 모든 family_id 가져오기
            family_ids = db.query(Family.id).distinct().all()
            
            all_messages = []
            
            for (address,) in addresses:
                if not address:
                    continue
                    
                messages_local = await self._fetch_disaster_data(address)
                if messages_local:
                    all_messages.extend(messages_local)
                    
                messages_all = await self._fetch_disaster_all_data(address)
                if messages_all:
                    all_messages.extend(messages_all)

            # 메시지 중복 제거 (SN 기준)
            unique_messages = {msg['SN']: msg for msg in all_messages}.values()
            
            # 한 번에 처리
            for message in unique_messages:
                sn = message.get('SN')
                for (family_id,) in family_ids:
                    # SN과 family_id로 중복 체크
                    existing = db.query(Notification).filter(
                        Notification.family_id == family_id,
                        Notification.message_sn == sn
                    ).first()
                    
                    if not existing:
                        notification = Notification(
                            family_id=family_id,
                            notification_grade='WARN',
                            descriptions=json.dumps(message, ensure_ascii=False),
                            message_sn=sn
                        )
                        db.add(notification)
            
            # 모든 처리가 끝난 후 한 번에 커밋
            db.commit()
            
        except Exception as e:
            logger.error(f"재난문자 업데이트 오류: {str(e)}")
            db.rollback()

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
            
            response = requests.get(url, params=params, verify=True)
            
            if response.status_code != 200:
                logger.error(f"Disaster API error: Status {response.status_code}")
                return []
                
            data = response.json()
            
            if data['body']:
                return data["body"]
            
            logger.info(f"No disaster messages found for address: {address}")
            return []
            
        except Exception as e:
            logger.error(f"재난문자 API 호출 오류: {str(e)}")
            return []
        
    async def _fetch_disaster_all_data(self, address: str) -> List[Dict]:
        try:
            url = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
            today = datetime.now().strftime("%Y%m%d")
            n_add = address.split(' ')[0] + ' ' + '전체'
            params = {
                "serviceKey": self.api_key,
                "returnType": "json",
                "pageNo": "1",
                "numOfRows": "5",
                "rgnNm": n_add,
                "crtDt": today
            }
            
            response = requests.get(url, params=params, verify=True)
            
            if response.status_code != 200:
                logger.error(f"Disaster API error: Status {response.status_code}")
                return []
                
            data = response.json()
            
            if data['body']:
                logger.info(f'{n_add} success')
                return data["body"]
            
            logger.info(f"No disaster messages found for address: {address}")
            return []
            
        except Exception as e:
            logger.error(f"재난문자 API 호출 오류: {str(e)}")
            return []