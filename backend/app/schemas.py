from pydantic import BaseModel
from typing import List

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_configured: bool
    balance: float

class SetupRequest(BaseModel):
    saldo: float
    categorias: List[str]

class ChatMessage(BaseModel):
    message: str