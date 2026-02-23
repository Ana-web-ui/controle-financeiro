from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..schemas.user import UserCreate
from ..database import get_db
from ..models import Transaction, Category,  User
from ..auth import get_current_user, hash_password, verify_password, create_access_token
from sqlalchemy import func
from ..database import SessionLocal
router = APIRouter()

# ----------------------
# REGISTRO
# ----------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed,
        is_configured=False  # 👈 prepara para primeiro acesso
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🔥 usa o ID igual no login
    access_token = create_access_token(
        data={"sub": str(new_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }




# ----------------------
# LOGIN
# ----------------------
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credenciais inválidas"
        )

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_configured": current_user.is_configured
    }


