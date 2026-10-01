from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from .models import Card


class CardManagementTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="carduser@example.com",
            name="Card User",
            password="TestPassword123"
        )

        login_response = self.client.post(
            "/api/auth/login/",
            {
                "email": "carduser@example.com",
                "password": "TestPassword123"
            },
            format="json"
        )

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

    def test_add_card(self):
        response = self.client.post(
            "/api/cards/add/",
            {
                "card_type": "CREDIT",
                "card_number": "4111111111111111",
                "cvv": "123",
                "expiry_month": 12,
                "expiry_year": 2030
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        card = Card.objects.get(user=self.user)

        self.assertEqual(card.last4, "1111")
        self.assertEqual(card.masked_card, "************1111")

    def test_list_cards(self):
        Card.objects.create(
            user=self.user,
            card_type="CREDIT",
            masked_card="************1111",
            last4="1111",
            expiry_month=12,
            expiry_year=2030
        )

        response = self.client.get("/api/cards/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_card(self):
        card = Card.objects.create(
            user=self.user,
            card_type="CREDIT",
            masked_card="************1111",
            last4="1111",
            expiry_month=12,
            expiry_year=2030
        )

        response = self.client.delete(
            f"/api/cards/{card.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Card.objects.filter(id=card.id).exists()
        )

    def test_unauthenticated_card_access(self):
        self.client.credentials()

        response = self.client.get("/api/cards/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )