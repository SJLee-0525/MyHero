"""
┏━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot AI Server ┃
┗━━━━━━━━━━━━━━━━━━━━┛
version : 0.0.1
"""

# Libraries
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
