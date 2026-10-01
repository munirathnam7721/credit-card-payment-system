from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Transaction.objects
            .filter(user=self.request.user)
            .select_related("card")
            .order_by("-created_at")
        )

        # Filter by status
        status = self.request.query_params.get("status")

        if status:
            queryset = queryset.filter(status=status.upper())

        # Filter by minimum amount
        min_amount = self.request.query_params.get("min_amount")

        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)

        # Filter by maximum amount
        max_amount = self.request.query_params.get("max_amount")

        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)

        # Filter by date
        date = self.request.query_params.get("date")

        if date:
            queryset = queryset.filter(created_at__date=date)

        return queryset