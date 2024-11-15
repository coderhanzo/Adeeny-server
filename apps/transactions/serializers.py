from curses import raw
from email.policy import default
import os
from rest_framework import serializers
from .models import Payments, Collections, CollectionsCard


class PaymentsSerializer(serializers.ModelSerializer):
    # operation = serializers.CharField(max_length=255, default="CREDIT")

    class Meta:
        model = Payments
        fields = "__all__"


class CollectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collections
        fields = [
            "transaction_id",
            "amount",
            "transaction_status",
            "account_name",
            "description",
            "account_number",
            "account_issuer",
            "callbackUrl",
        ]
        extra_kwargs = {
            "amount": {"required": True},
            "account_name": {"required": True},
            "account_number": {"required": True},
            "account_issuer": {"required": True},
        }


class NameEnquirySerializer(serializers.Serializer):
    account_type = serializers.CharField(max_length=100)
    account_number = serializers.CharField(max_length=100)
    account_issuer = serializers.CharField(max_length=100)


class CardDetailsSerializer(serializers.Serializer):
    number = serializers.CharField(max_length=16, write_only=True)
    cvc = serializers.CharField(max_length=4, write_only=True)
    expiry = serializers.CharField(max_length=7, write_only=True)


class CollectionsCardSerializer(serializers.ModelSerializer):
    card = CardDetailsSerializer(write_only=True)

    class Meta:
        model = CollectionsCard
        fields = "__all__"

    def create(self, validated_data):
        # Retrieve the nested 'card' data and separate it from the rest
        card_data = validated_data.pop("card", None)

        # Create a new card instance with remaining data
        card_instance = CollectionsCard(**validated_data)

        # Hash the card data if provided
        if card_data:
            card_instance.salt = os.urandom(20)  # Generate a random salt for hashing
            card_instance.number = card_instance._hash_value(
                card_data["card_number"], card_instance.salt
            )
            card_instance.cvc = card_instance._hash_value(
                card_data["cvc"], card_instance.salt
            )
            card_instance.expiry = card_instance._hash_value(
                card_data["expiry"], card_instance.salt
            )

        card_instance.save()
        return card_instance
