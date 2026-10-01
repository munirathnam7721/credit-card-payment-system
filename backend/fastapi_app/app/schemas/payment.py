from decimal import Decimal

from pydantic import BaseModel, Field


class PaymentRequest(BaseModel):

    card_id: int = Field(
        gt=0,
        description="Saved card ID",
    )

    amount: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
        description="Payment amount",
    )


class PaymentResponse(BaseModel):

    transaction_id: int

    transaction_reference: str

    amount: Decimal

    status: str

    message: str