from django.db import models
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from django.contrib.auth import get_user_model
import uuid

# Create your models here.

# 2 tables: payments(donations) and collections(WAQF donations)
# User = get_user_model()


# this model will replace donations
class Payments(models.Model):
    NETWORK_TYPE_CHOICES = (
        ("MTN", "mtn"),
        ("vodafone", "vodafone"),
        ("AIRTELTIGO", "airteltigo"),
    )
    external_transaction_id = models.UUIDField(
        default=uuid.uuid4, editable=False, primary_key=True
    )
    amount = models.CharField(max_length=100)
    account_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    account_issuer = models.CharField(max_length=100, choices=NETWORK_TYPE_CHOICES)
    # this will be for the database, so every trnasaction will have an id, we can use uuid for this,
    # then we will have to call it in the view or call back url when we need to verify the payment
    created_at = models.DateTimeField(auto_now_add=True)

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
        max_length=10, choices=PAYMENT_STATUS_CHOICES, default="pending"
    )
    account_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    account_issuer = models.CharField(max_length=100, choices=NETWORK_TYPE_CHOICES)
    callback_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    external_transaction_id = models.UUIDField(
        default=uuid.uuid4, editable=False, primary_key=True
    )

    def __str__(self):
        return f"Collection: {self.amount} - {self.transaction_status} - {self.external_transaction_id}"
