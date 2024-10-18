from rest_framework import serializers
from .models import Payments, Collections


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
