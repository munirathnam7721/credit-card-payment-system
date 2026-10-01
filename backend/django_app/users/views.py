from rest_framework import generics
from rest_framework.permissions import AllowAny

from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)





class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Logout successful."},
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )