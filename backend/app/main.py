from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routes import chat, user_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🔥 CORS PRIMEIRO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # depois podemos restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Depois as rotas
app.include_router(chat.router)
app.include_router(user_routes.router)
