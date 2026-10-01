from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    card_display = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            "id",
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