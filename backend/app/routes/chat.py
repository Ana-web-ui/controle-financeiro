from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from ..models import Transaction, Category
from ..database import SessionLocal, get_db
from ..models import Transaction
from ..services.parser import parse_message
from ..schemas import ChatMessage
from ..auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/")
def chat(
    payload: ChatMessage,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    mensagem = payload.message.strip()

    # ===============================
    # 🔥 1️⃣ ONBOARDING
    # ===============================

    if not current_user.is_configured:

        # Se ainda não tem saldo definido
        if current_user.balance == 0:

            # tenta converter a mensagem para número
            try:
                saldo = float(mensagem.replace(",", "."))
                current_user.balance = saldo
                db.commit()

                return {
                    "mensagem": "Perfeito! 💜\nAgora me diga quais categorias você quer usar (separadas por vírgula)."
                }

            except ValueError:
                return {
                    "mensagem": "Qual é o seu saldo inicial? 💰"
                }

        # Se já tem saldo mas ainda não configurou categorias
        else:
            categorias = [c.strip() for c in mensagem.split(",")]

            for nome in categorias:
                nova_categoria = Category(
                    name=nome,
                    user_id=current_user.id
                )
                db.add(nova_categoria)

            current_user.is_configured = True
            db.commit()

            return {
                "mensagem": "Configuração concluída com sucesso 🎉\nAgora você pode registrar seus gastos!"
            }

    # ===============================
    # 💸 2️⃣ MODO NORMAL (registrar gasto)
    # ===============================

    data = parse_message(mensagem)

    if not data["valor"]:
        return {
            "mensagem": "Não consegui identificar o valor do gasto 😕"
        }

    transaction = Transaction(
        description=data["descricao"],
        amount=data["valor"],
        date=date.today(),
        user_id=current_user.id
    )

    db.add(transaction)
    db.commit()

    # calcula saldo
    total_gastos = db.query(Transaction.amount).filter(
        Transaction.user_id == current_user.id
    ).all()

    saldo_atual = current_user.balance - sum(v[0] for v in total_gastos)

    return {
        "mensagem": "Gasto registrado com sucesso ✅",
        "saldo_atual": saldo_atual
    }
