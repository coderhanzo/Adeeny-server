from curses import raw
import os
from rest_framework import serializers
from .models import Payments, Collections, CollectionsCard


class PaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payments
        fields = [
            "amount",
            "account_name",
            "account_number",
            "account_issuer",
            "external_transaction_id",
        ]
        extra_kwargs = {
            "amount": {"required": True},
            "account_name": {"required": True},
            "account_number": {"required": True},
            "account_issuer": {"required": True},
        }


class CollectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collections
        fields = [
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
    account_name = serializers.CharField(max_length=100)
    account_number = serializers.CharField(max_length=100)
    account_issuer = serializers.CharField(max_length=100)

class CardDetailsSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=16, write_only=True)
    cvv = serializers.CharField(max_length=4, write_only=True)
    expiry = serializers.CharField(max_length=7, write_only=True)


class CollectionsCardSerializer(serializers.ModelSerializer):
    card = CardDetailsSerializer()
    class Meta:
        model = CollectionsCard
        # fields = {"id"}
        fields = "__all__"

    def create(self, validated_data):
        # Retrieve raw card data from input, then remove them from validated data
        raw_card_number = validated_data.pop("card_number", None)
        raw_cvv = validated_data.pop("cvv", None)
        raw_expiry = validated_data.pop("expiry", None)

        # create new a card instance without saving it
        card_instance = CollectionsCard(**validated_data)

        if raw_card_number and raw_cvv and raw_expiry:
            card_instance.salt = os.urandom(20)
            card_instance.card_number = card_instance._hash_value(
                raw_card_number, card_instance.salt
            )
            card_instance.cvv = card_instance._hash_value(raw_cvv, card_instance.salt)
            card_instance.expiry = card_instance._hash_value(
                raw_expiry, card_instance.salt
            )

        card_instance.save()
        return card_instance
