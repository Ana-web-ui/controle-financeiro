from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from ..models import Transaction, Category, User
from ..database import get_db
from ..services.parser import parse_message
from ..schemas import ChatMessage
from ..auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(
    payload: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    mensagem = payload.message.strip()

    # ==================================================
    # 🔥 1️⃣ ONBOARDING CONTROLADO POR setup_step
    # ==================================================

    if current_user.setup_step != "completed":

        # ==============================
        # ETAPA 1 - SALDO INICIAL
        # ==============================
        if current_user.setup_step == "waiting_balance":

            try:
                saldo = float(mensagem.replace(",", "."))
                current_user.balance = saldo
                current_user.setup_step = "waiting_categories"
                db.commit()

                return {
                    "mensagem": "Perfeito! 💜 Agora me diga quais categorias você quer usar (separadas por vírgula)."
                }

            except ValueError:
                return {
                    "mensagem": "Qual é o seu saldo inicial? 💰"
                }

        # ==============================
        # ETAPA 2 - CATEGORIAS
        # ==============================
        if current_user.setup_step == "waiting_categories":

            categorias = [c.strip() for c in mensagem.split(",") if c.strip()]

            if not categorias:
                return {
                    "mensagem": "Por favor, informe ao menos uma categoria."
                }

            for nome in categorias:
                db.add(Category(name=nome, user_id=current_user.id))

            current_user.setup_step = "completed"
            current_user.is_configured = True
            db.commit()

            return {
                "mensagem": "Configuração concluída com sucesso 🎉 Agora você pode registrar seus gastos!"
            }

    # ==================================================
    # 💸 2️⃣ MODO NORMAL - REGISTRAR TRANSAÇÃO
    # ==================================================

    data = parse_message(mensagem)

    if not data.get("valor"):
        return {
            "mensagem": "Não consegui identificar o valor do gasto 😕"
        }

    # 🔎 tenta encontrar categoria pelo nome
    categoria = db.query(Category).filter(
        Category.user_id == current_user.id,
        Category.name.ilike(f"%{data.get('categoria', '')}%")
    ).first()

    transaction = Transaction(
        description=data.get("descricao", "Gasto"),
        amount=data["valor"],
        date=date.today(),
        user_id=current_user.id,
        category_id=categoria.id if categoria else None
    )

    db.add(transaction)
    db.commit()

    # calcula total gasto corretamente
    total_gastos = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id
    ).scalar() or 0

    saldo_atual = current_user.balance - total_gastos

    return {
        "mensagem": "Gasto registrado com sucesso ✅",
        "saldo_atual": saldo_atual
    }