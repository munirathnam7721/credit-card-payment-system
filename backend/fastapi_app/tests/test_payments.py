
from decimal import Decimal
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api.payments import get_current_user
from app.core.database import get_db


class FakeResult:
    def __init__(self, card_exists=True):
        self.card_exists = card_exists

    def fetchone(self):
        if self.card_exists:
            return SimpleNamespace(id=1)
        return None


class FakeDB:
    def __init__(self, card_exists=True):
        self.card_exists = card_exists

    def execute(self, query, params):
        return FakeResult(self.card_exists)


@pytest.fixture
def setup_client():
    fake_db = FakeDB()

    app.dependency_overrides[get_db] = lambda: fake_db
    app.dependency_overrides[get_current_user] = lambda: 1

    client = TestClient(app)

    yield client, fake_db

    app.dependency_overrides.clear()


def test_payment_success(setup_client, monkeypatch):
    client, fake_db = setup_client

    def fake_process_payment(db, user_id, card_id, amount):
        transaction = SimpleNamespace(
            id=101,
            transaction_reference="TXN-TESTSUCCESS",
            amount=amount,
            status="SUCCESS",
        )
        return transaction, "Payment successful."

    monkeypatch.setattr(
        "app.api.payments.process_payment",
        fake_process_payment,
    )

    response = client.post(
        "/api/payments/",
        json={"card_id": 1, "amount": "100.00"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"
    assert response.json()["amount"] == "100.00"
    assert response.json()["message"] == "Payment successful."


def test_payment_failure(setup_client, monkeypatch):
    client, fake_db = setup_client

    def fake_process_payment(db, user_id, card_id, amount):
        transaction = SimpleNamespace(
            id=102,
            transaction_reference="TXN-TESTFAILED",
            amount=amount,
            status="FAILED",
        )
        return transaction, "Payment failed."

    monkeypatch.setattr(
        "app.api.payments.process_payment",
        fake_process_payment,
    )

    response = client.post(
        "/api/payments/",
        json={"card_id": 1, "amount": "250.00"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "FAILED"
    assert response.json()["message"] == "Payment failed."


def test_payment_with_invalid_card(setup_client):
    client, fake_db = setup_client
    fake_db.card_exists = False

    response = client.post(
        "/api/payments/",
        json={"card_id": 999, "amount": "100.00"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Card not found."


def test_payment_without_authentication(setup_client):
    client, fake_db = setup_client

    app.dependency_overrides.pop(get_current_user, None)

    response = client.post(
        "/api/payments/",
        json={"card_id": 1, "amount": "100.00"},
    )

    assert response.status_code == 401


@pytest.mark.parametrize(
    "amount",
    ["0", "-10.00"],
)
def test_payment_with_invalid_amount(setup_client, amount):
    client, fake_db = setup_client

    response = client.post(
        "/api/payments/",
        json={"card_id": 1, "amount": amount},
    )

    assert response.status_code == 422