from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from ..database import SessionLocal
from ..models import Transaction
from ..services.parser import parse_message
from ..schemas import ChatMessage
from ..auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SALDO_INICIAL = 3000

@router.post("/")
def chat(
    payload: ChatMessage,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    data = parse_message(payload.message)

    if not data["valor"]:
        raise HTTPException(
            status_code=400,
            detail="Não consegui identificar o valor do gasto 😕"
        )

    transaction = Transaction(
        valor=data["valor"],
        categoria=data["categoria"],
        descricao=data["descricao"],
        data=date.today(),
        user_id=current_user.id  # 🔥 AQUI É O PULO DO GATO
    )

    db.add(transaction)
    db.commit()

    total_gastos = db.query(Transaction.valor).filter(
        Transaction.user_id == current_user.id
    ).all()

    saldo_atual = SALDO_INICIAL - sum(v[0] for v in total_gastos)

    return {
        "mensagem": "Gasto registrado com sucesso ✅",
        "categoria": data["categoria"],
        "gasto": data["valor"],
        "saldo_atual": saldo_atual
    }

