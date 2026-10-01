from datetime import date

from rest_framework import serializers

from .models import Card


class CardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(
        write_only=True,
        min_length=13,
        max_length=19,
    )

    cvv = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=4,
    )

    class Meta:
        model = Card
        fields = [
            "id",
            "card_type",
            "card_number",
            "cvv",
            "masked_card",
            "last4",
            "expiry_month",
            "expiry_year",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "masked_card",
            "last4",
            "created_at",
        ]

    def validate_card_number(self, value):
        # Remove spaces and hyphens entered by the user
        value = value.replace(" ", "").replace("-", "")

        # Card number must contain digits only
        if not value.isdigit():
            raise serializers.ValidationError(
                "Card number must contain digits only."
            )

        # Length validation
        if not 13 <= len(value) <= 19:
            raise serializers.ValidationError(
                "Card number must contain between 13 and 19 digits."
            )

        # Luhn algorithm validation
        digits = [int(digit) for digit in value]

        checksum = 0
        parity = len(digits) % 2

        for index, digit in enumerate(digits):
            if index % 2 == parity:
                digit *= 2

                if digit > 9:
                    digit -= 9

            checksum += digit

        if checksum % 10 != 0:
            raise serializers.ValidationError(
                "Invalid card number."
            )

        return value

    def validate_cvv(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "CVV must contain digits only."
            )

        if len(value) not in (3, 4):
            raise serializers.ValidationError(
                "CVV must contain 3 or 4 digits."
            )

        return value

    def validate_expiry_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError(
                "Expiry month must be between 1 and 12."
            )

        return value

    def validate_expiry_year(self, value):
        current_year = date.today().year

        if value < current_year:
            raise serializers.ValidationError(
                "Card has expired."
            )

        if value > current_year + 20:
            raise serializers.ValidationError(
                "Invalid expiry year."
            )

        return value

    def validate(self, attrs):
        expiry_month = attrs.get("expiry_month")
        expiry_year = attrs.get("expiry_year")

        current_date = date.today()

        if (
            expiry_year == current_date.year
            and expiry_month < current_date.month
        ):
            raise serializers.ValidationError(
                {
                    "expiry_month": "Card expiry date has passed."
                }
            )

        return attrs

    def create(self, validated_data):
        # Card number is used only temporarily.
        # It is NEVER stored in the database.
        card_number = validated_data.pop("card_number")

        # CVV is also removed and NEVER stored.
        validated_data.pop("cvv")

        validated_data["last4"] = card_number[-4:]

        validated_data["masked_card"] = (
            "*" * (len(card_number) - 4)
            + card_number[-4:]
        )

        return Card.objects.create(**validated_data)