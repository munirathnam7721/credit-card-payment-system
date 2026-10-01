from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions_transaction"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    card_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="PENDING",
    )

    transaction_reference: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )