from rest_framework import serializers
from transactions.models import Transaction


class AdminTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    card_display = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user_email",
            "card_display",
            "amount",
            "status",
            "transaction_reference",
            "created_at",
            "updated_at",
        ]

    def get_card_display(self, obj):
        if obj.card:
            return obj.card.masked_card
        return None

from rest_framework import serializers
from transactions.models import Transaction


class DailyPaymentSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_transactions = serializers.IntegerField()
    successful_transactions = serializers.IntegerField()
    failed_transactions = serializers.IntegerField()
    total_success_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

from users.models import User
from cards.models import Card


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "is_admin",
            "is_active",
            "created_at",
        ]


class AdminCardSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Card
        fields = [
            "id",
            "user_email",
            "card_type",
            "masked_card",
            "last4",
            "expiry_month",
            "expiry_year",
            "created_at",
        ]