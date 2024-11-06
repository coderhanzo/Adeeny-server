from django.db import models
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from django.contrib.auth import get_user_model
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from hashlib import sha256
import os
import uuid

# this model will replace donations
class Payments(models.Model):
    external_transaction_id = models.UUIDField(
        default=uuid.uuid4, editable=False, primary_key=True
    )
    amount = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    account_issuer = models.CharField(max_length=100)
    # this will be for the database, so every trnasaction will have an id, we can use uuid for this,
    # then we will have to call it in the view or call back url when we need to verify the payment
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account_name} {self.account_number} {self.created_at}"


# this model will replace WAQF donations/ projectdonations
class Collections(models.Model):
    NETWORK_TYPE_CHOICES = (
        ("MTN", "mtn"),
        ("vodafone", "vodafone"),
        ("AIRTELTIGO", "airteltigo"),
    )
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]
    amount = models.CharField(max_length=100)
    transaction_status = models.CharField(
        max_length=100, choices=PAYMENT_STATUS_CHOICES, default="pending"
    )
    account_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    account_issuer = models.CharField(max_length=100)
    callbackUrl = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=50, default="transaction description")
    external_transaction_id = models.UUIDField(
        default=uuid.uuid4, editable=False, primary_key=True
    )

    def __str__(self):
        return f"Collection: {self.amount} - {self.transaction_status} - {self.external_transaction_id}"

class CollectionsCard(models.Model):
    account_name = models.CharField(max_length=100, default="card_account_name")
    amount = models.CharField(max_length=100, default="card_account_amount")
    callbackUrl = models.URLField(blank=True, null=True)
    clientRedirectUrl = models.URLField(blank=True, null=True)
    description = models.CharField(max_length=50, default="transaction description")
    card_number = models.BinaryField(
        editable=False
    )  # Store as binary data after hashing
    cvv = models.BinaryField(editable=False)
    expiry = models.BinaryField(editable=False)
    salt = models.BinaryField(editable=False)  # Salt is binary data

    def _hash_value(self, value, salt):
        # PBKDF2HMAC key derivation function
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend(),
        )
        return kdf.derive(value.encode())  # Convert value to bytes for hashing

    def __str__(self):
        return f"Card Info (Hashed): {self.card_number[:10]}... with Salt"
