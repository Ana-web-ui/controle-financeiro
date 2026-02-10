from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from ..database import SessionLocal
from ..models import Transaction
from ..services.parser import parse_message

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/chat")
def chat(message: str, db: Session = Depends(get_db)):
    data = parse_message(message)

    if not data["valor"]:
        raise HTTPException(status_code=400, detail="Não consegui identificar o valor.")

    transaction = Transaction(
        valor=data["valor"],
        categoria=data["categoria"],
        descricao=data["descricao"],
        data=date.today()
    )

    db.add(transaction)
    db.commit()

    total_gastos = db.query(Transaction).with_entities(
        Transaction.valor
    ).all()

    saldo_atual = 3000 - sum(v[0] for v in total_gastos)  # saldo fixo por enquanto

    return {
        "categoria": data["categoria"],
        "gasto": data["valor"],
        "saldo_atual": saldo_atual
    }
