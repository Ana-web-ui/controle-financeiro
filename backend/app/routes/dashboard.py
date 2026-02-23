from unicodedata import category
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import SessionLocal
from ..models import Transaction, Category, User
from ..auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # total gasto
    total_gasto = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id
    ).scalar() or 0

    saldo_atual = current_user.balance - total_gasto

    gastos_categoria = (
    db.query(
        Category.name,
        func.sum(Transaction.amount)
    )
    .join(Transaction, Transaction.category_id == Category.id)
    .filter(Transaction.user_id == current_user.id)
    .group_by(Category.name)
    .all()
)

    return {
        "saldo_inicial": current_user.balance,
        "saldo_atual": saldo_atual,
        "total_gasto": total_gasto,
        "categorias": [c.name for c in category],
        "gastos_por_categoria": [
            {"categoria": g[0], "total": g[1]} for g in gastos_categoria
        ]
    }