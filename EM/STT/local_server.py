from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os
import logging
import signal
import sys
import time

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
    allow_methods=["*"],
    allow_headers=["*"]
)

class UserID(BaseModel):
    user_id: str

processes = {
    'stt': None,
    'rsvp': None
}

@app.post("/bluetooth/speaker/connect")
async def connect_bluetooth_speaker():
   try:
       result = subprocess.run(['bluetoothctl', 'connect', '5C:FB:7C:34:59:29'], capture_output=True, text=True)
       if result.returncode == 0:
           return {"status": "success", "message": "bluetooth speaker connected"}
       else:
           return {"status": "error", "message": result.stderr}
   except Exception as e:
       return {"status": "error", "message": str(e)}
   
@app.post("/bluetooth/speaker/volume")
async def set_bluetooth_speaker_volume(volume: int):
    try:
        sinks = subprocess.run(['pactl', 'list', 'sinks'], capture_output=True, text=True)
        
        bluetooth_sink = None
        for line in sinks.stdout.split('\n'):
            if '5C:FB:7C:34:59:29' in line:  
                sink_lines = [l for l in sinks.stdout.split('\n') if 'Name:' in l]
                for sink_line in sink_lines:
                    if 'bluez' in sink_line:
                        bluetooth_sink = sink_line.split(':')[1].strip()
                        break
        
        if not bluetooth_sink:
            return {"status": "error", "message": "Bluetooth speaker sink not found"}
            
        if not 0 <= volume <= 100:
            return {"status": "error", "message": "Volume must be between 0 and 100"}
            
        result = subprocess.run(
            ['pactl', 'set-sink-volume', bluetooth_sink, f'{volume}%'], 
            capture_output=True, 
            text=True
        )
        
        if result.returncode == 0:
            return {
                "status": "success", 
                "message": f"Bluetooth speaker volume set to {volume}%",
                "sink": bluetooth_sink
            }
        else:
            return {"status": "error", "message": result.stderr}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}

def start_processes(user_id: str):
    try:
        stop_processes()

        if os.path.exists('user_id.txt'):
            os.remove('user_id.txt')

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
                process.wait(timeout=10)
                logger.info(f"Terminated {name} process")
            except subprocess.TimeoutExpired:
                process.terminate()
                time.sleep(2)
                if process.poll() is None:
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