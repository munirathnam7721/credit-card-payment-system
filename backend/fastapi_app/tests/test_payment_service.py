
from decimal import Decimal

from app.services.payment_service import process_payment


class FakeDB:
    def __init__(self):
        self.transaction = None
        self.commit_statuses = []

    def add(self, transaction):
        self.transaction = transaction

    def commit(self):
        if self.transaction is not None:
            self.commit_statuses.append(self.transaction.status)

    def refresh(self, transaction):
        pass


def test_process_payment_success(monkeypatch):
    db = FakeDB()
    monkeypatch.setattr(
        "app.services.payment_service.random.choice",
        lambda choices: True,
    )

    transaction, message = process_payment(
        db=db,
        user_id=1,
        card_id=1,
        amount=Decimal("100.00"),
    )

    assert transaction.status == "SUCCESS"
    assert message == "Payment successful."
    assert transaction.amount == Decimal("100.00")
    assert transaction.transaction_reference.startswith("TXN-")
    assert db.commit_statuses == ["PENDING", "SUCCESS"]


def test_process_payment_failure(monkeypatch):
    db = FakeDB()
    monkeypatch.setattr(
        "app.services.payment_service.random.choice",
        lambda choices: False,
    )

    transaction, message = process_payment(
        db=db,
        user_id=1,
        card_id=1,
        amount=Decimal("250.00"),
    )

    assert transaction.status == "FAILED"
    assert message == "Payment failed."
    assert transaction.amount == Decimal("250.00")
    assert db.commit_statuses == ["PENDING", "FAILED"]