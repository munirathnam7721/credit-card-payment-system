from decimal import Decimal

from rest_framework.test import APITestCase
from rest_framework import status

from users.models import User
from cards.models import Card
from .models import Transaction


class TransactionTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="transaction@example.com",
            name="Transaction User",
            password="TestPassword123"
        )

        login_response = self.client.post(
            "/api/auth/login/",
            {
                "email": "transaction@example.com",
                "password": "TestPassword123"
            },
            format="json"
        )

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        self.card = Card.objects.create(
            user=self.user,
            card_type="CREDIT",
            masked_card="************1111",
            last4="1111",
            expiry_month=12,
            expiry_year=2030
        )

    def test_transaction_creation(self):
        transaction = Transaction.objects.create(
            user=self.user,
            card=self.card,
            amount=Decimal("100.00"),
            status="SUCCESS",
            transaction_reference="TEST-TXN-001"
        )

        self.assertEqual(transaction.amount, Decimal("100.00"))
        self.assertEqual(transaction.status, "SUCCESS")
        self.assertEqual(transaction.user, self.user)

    def test_transaction_status_choices(self):
        transaction = Transaction.objects.create(
            user=self.user,
            card=self.card,
            amount=Decimal("50.00"),
            status="PENDING",
            transaction_reference="TEST-TXN-002"
        )

        self.assertEqual(transaction.status, "PENDING")