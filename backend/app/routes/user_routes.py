from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..schemas.user import UserCreate
from ..database import get_db
from ..models import User
from ..auth import hash_password, verify_password, create_access_token

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

    new_user = User(email=user.email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuário criado com sucesso"}



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
