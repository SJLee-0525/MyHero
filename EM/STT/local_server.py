from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os
import logging
import signal
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_method=["*"],
    allow_headers=["*"]
)

class UserID(BaseModel):
    user_id: str

processes = {
    'stt': None,
    'rsvp': None
}

def start_processes(user_id: str):
    try:
        stop_processes()
        
        with open('user_id.txt', 'w') as f:
            f.write(user_id)
        
        logger.info("Starting STT process...")
        processes['stt'] = subprocess.Popen(['python', 'main.py'])
        
        logger.info("Starting RSVP process...")
        processes['rsvp'] = subprocess.Popen(['./rsvp_project'], 
                                           cwd=os.path.expanduser('~/project/rsvp/build'))
        
        logger.info("All processes started successfully")
        return True
    except Exception as e:
        logger.error(f"Error starting processes: {e}")
        stop_processes() 
        return False

def stop_processes():
    for name, process in processes.items():
        if process:
            try:
                process.terminate()
                process.wait(timeout=5)  
                logger.info(f"Terminated {name} process")
            except subprocess.TimeoutExpired:
                process.kill()  
                logger.info(f"Killed {name} process")
            except Exception as e:
                logger.error(f"Error stopping {name} process: {e}")
            processes[name] = None

@app.post("/api/userid")
async def set_userid(data: UserID):
    success = start_processes(data.user_id)
    return {"success": success, "user_id": data.user_id}

@app.on_event("shutdown")
async def shutdown_event():
    stop_processes()

def signal_handler(signum, frame):
    logger.info("Shutdown signal received")
    stop_processes()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)