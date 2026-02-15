from typing import Annotated
from pydantic import BaseModel, field_validator, StringConstraints,  Field

class UserCreate(BaseModel):
    email: str
    password: str = Field(..., min_length=6, max_length=72)



class UserResponse(BaseModel):
    id: int
    email: str