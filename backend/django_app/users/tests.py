from rest_framework.test import APITestCase
from rest_framework import status
from .models import User


class AuthenticationTests(APITestCase):

    def setUp(self):
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.profile_url = "/api/auth/profile/"

        self.user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "TestPassword123"
        }

    def test_user_registration(self):
        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(email="test@example.com").exists()
        )

    def test_user_login(self):
        User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="TestPassword123"
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "test@example.com",
                "password": "TestPassword123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_profile_requires_authentication(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_authenticated_profile(self):
        user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="TestPassword123"
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "test@example.com",
                "password": "TestPassword123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], user.email)