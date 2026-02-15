from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routes import chat, user_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(chat.router)
app.include_router(user_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
