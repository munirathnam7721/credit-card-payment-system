import random
import uuid
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def process_payment(
    db: Session,
    user_id: int,
    card_id: int,
    amount: Decimal,
):

    transaction_reference = (
        f"TXN-{uuid.uuid4().hex[:12].upper()}"
    )

    transaction = Transaction(
        user_id=user_id,
        card_id=card_id,
        amount=amount,
        status="PENDING",
        transaction_reference=transaction_reference,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    # Payment simulation
    payment_success = random.choice([True, False])

    if payment_success:
        transaction.status = "SUCCESS"
        message = "Payment successful."
    else:
        transaction.status = "FAILED"
        message = "Payment failed."

    db.commit()
    db.refresh(transaction)

    return transaction, message