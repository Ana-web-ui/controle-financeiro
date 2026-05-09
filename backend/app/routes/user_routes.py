from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas.user import UserCreate
from ..database import get_db
from ..models import RefreshToken, User
from ..auth import get_current_user, hash_password, verify_password, create_access_token
from ..utils import REFRESH_TOKEN_EXPIRE_DAYS, create_refresh_token, decode_token  # ← relativo também

router = APIRouter(prefix="/auth", tags=["auth"])  # ← removido o router duplicado

class RefreshRequest(BaseModel):
    refresh_token: str

# ----------------------
# REGISTRO
# ----------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    hashed = hash_password(user.password)
    new_user = User(email=user.email, password=hashed, is_configured=False)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": str(new_user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


# ----------------------
# LOGIN
# ----------------------
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):  # ← era user.hashed_password, mas seu model usa user.password
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    db_token = RefreshToken(
        token=refresh_token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


# ----------------------
# REFRESH
# ----------------------
@router.post("/refresh")
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(request.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Refresh token inválido")

    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == request.refresh_token,
        RefreshToken.revoked == False
    ).first()

    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token expirado ou revogado")

    new_access_token = create_access_token({"sub": payload["sub"]})

    return {"access_token": new_access_token, "token_type": "bearer"}


# ----------------------
# ME
# ----------------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_configured": current_user.is_configured
    }


# ----------------------
# LOGOUT
# ----------------------
@router.post("/logout")
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == request.refresh_token
    ).first()

    if db_token:
        db_token.revoked = True
        db.commit()

    return {"message": "Logout realizado com sucesso"}