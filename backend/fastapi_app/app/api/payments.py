from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.schemas.payment import (
    PaymentRequest,
    PaymentResponse,
)
from app.services.payment_service import process_payment


router = APIRouter()


@router.post(
    "/",
    response_model=PaymentResponse,
)
def make_payment(
    payment: PaymentRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):

    card = db.execute(
        text("""
            SELECT id
            FROM cards_card
            WHERE id = :card_id
            AND user_id = :user_id
        """),
        {
            "card_id": payment.card_id,
            "user_id": user_id,
        },
    ).fetchone()

    if not card:
        raise HTTPException(
            status_code=404,
            detail="Card not found.",
        )

    transaction, message = process_payment(
        db=db,
        user_id=user_id,
        card_id=payment.card_id,
        amount=payment.amount,
    )

    return PaymentResponse(
        transaction_id=transaction.id,
        transaction_reference=transaction.transaction_reference,
        amount=transaction.amount,
        status=transaction.status,
        message=message,
    )