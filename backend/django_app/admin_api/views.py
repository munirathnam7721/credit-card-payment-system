import csv
from users.models import User
from cards.models import Card
from rest_framework import serializers
from django.http import HttpResponse
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from transactions.models import Transaction
from rest_framework import generics
from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncDate
from .serializers import AdminTransactionSerializer
class TransactionCSVExportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        transactions = (
            Transaction.objects
            .select_related("user", "card")
            .order_by("-created_at")
        )

        response = HttpResponse(
            content_type="text/csv"
        )

        response["Content-Disposition"] = (
            'attachment; filename="transactions.csv"'
        )

        writer = csv.writer(response)

        writer.writerow([
            "ID",
            "User Email",
            "Card",
            "Amount",
            "Status",
            "Transaction Reference",
            "Created At",
            "Updated At",
        ])

        for transaction in transactions:
            writer.writerow([
                transaction.id,
                transaction.user.email,
                transaction.card.masked_card if transaction.card else "",
                transaction.amount,
                transaction.status,
                transaction.transaction_reference,
                transaction.created_at,
                transaction.updated_at,
            ])

        return response

class DailyPaymentSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        summary = (
            Transaction.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(
                total_transactions=Count("id"),
                successful_transactions=Count(
                    "id",
                    filter=Q(status="SUCCESS"),
                ),
                failed_transactions=Count(
                    "id",
                    filter=Q(status="FAILED"),
                ),
                total_success_amount=Sum(
                    "amount",
                    filter=Q(status="SUCCESS"),
                ),
            )
            .order_by("-date")
        )

        data = []

        for item in summary:
            data.append({
                "date": item["date"],
                "total_transactions": item["total_transactions"],
                "successful_transactions": item["successful_transactions"],
                "failed_transactions": item["failed_transactions"],
                "total_success_amount": (
                    item["total_success_amount"] or 0
                ),
            })

        return Response(data)

from users.models import User
from cards.models import Card

from .serializers import (
    AdminUserSerializer,
    AdminCardSerializer,
)
class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.all().order_by("-created_at")

class AdminCardListView(generics.ListAPIView):
    serializer_class = AdminCardSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return (
            Card.objects
            .select_related("user")
            .all()
            .order_by("-created_at")
        )


class AdminTransactionListView(generics.ListAPIView):
    serializer_class = AdminTransactionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return (
            Transaction.objects
            .select_related("user", "card")
            .all()
            .order_by("-created_at")
        )