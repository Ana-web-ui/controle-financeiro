from fastapi import FastAPI
from .database import engine
from .models import Base
from .routes import chat

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(chat.router)
