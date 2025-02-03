import requests
import logging
import aiohttp
import asyncio
from typing import Dict, List, Optional
import time

logger = logging.getLogger(__name__)

class NewsService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.categories = [
            "business", "entertainment", "environment", "health",
            "politics", "science", "sports", "technology"
        ]

    async def get_news(self) -> Dict[str, List[Dict]]:
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_category_news(session, category) for category in self.categories]
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        news_dict = {}
        for category, result in zip(self.categories, results):
            if isinstance(result, Exception):
                logger.error(f"Error fetching news for {category}: {str(result)}")
            else:
                news_dict[category] = result
            
            time.sleep(1)

        return news_dict

    async def fetch_category_news(self, session: aiohttp.ClientSession, category: str) -> Optional[List[Dict]]:
        url = f"https://newsdata.io/api/1/latest?apikey={self.api_key}&country=kr&language=ko&category={category}"
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('results', [])
                else:
                    logger.error(f"News API HTTP error for {category}: {response.status}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching news for {category}: {str(e)}")
            return None
