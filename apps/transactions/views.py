import stat
from urllib import response
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payments, Collections, CollectionsCard
from .serializers import (
    PaymentsSerializer,
    CollectionsSerializer,
    CollectionsCardSerializer,
    NameEnquirySerializer,
)
from .services import PeoplesPayService
from django.urls import reverse
import requests
import uuid


class TokenView(APIView):
    def get(self, request):
        token = PeoplesPayService.get_token()

        if token:
            return Response({"token": token}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Failed to retrieve token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaymentsView(APIView):
    def post(self, request):
        payment_serializer = PaymentsSerializer(data=request.data)

        # Get the token using the PeoplesPayService from the .get_token() method
        token = PeoplesPayService.get_token()
        if token is None:
            print(token, f"token")
            return Response(
                {"message": "Failed to retrieve token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if payment_serializer.is_valid():
            validated_data = payment_serializer.validated_data
            print(validated_data, f"validated data")
        # Disburse payment
        disburse_payload = {
            "amount": str(validated_data["amount"]),
            "account_number": validated_data["account_number"],
            "account_name": validated_data["account_name"],
            "account_issuer": validated_data["account_issuer"],
            # "external_transaction_id": validated_data["external_transaction_id"],
            # "description": validated_data["description"],
        }
        disburse_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token['data']}",
        }
        print(disburse_payload, f"Disburse payload")

        try:
            disburse_response = requests.post(
                f"{PeoplesPayService.BASE_URL}/disburse",
                json=disburse_payload,
                headers=disburse_headers,
            )
            disburse_data = disburse_response.json()
            print(disburse_data, f"disburse_data")

            if disburse_response.status_code == 200 and disburse_data.get("success"):
                payment_serializer.save()  # Save payment record to the database
                return Response(
                    {"message": "Payment processed successfully"},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"message": disburse_data.get("message", "Payment failed")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"message": f"Error processing payment: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CollectionsView(APIView):
    def post(self, request):
        collection_serializer = CollectionsSerializer(data=request.data)

        # Generate the external_transaction_id at the start
        external_transaction_id = uuid.uuid4()
        print("take a look")

        if collection_serializer.is_valid():
            print("if passed")
            validated_data = collection_serializer.validated_data

            # Assign the external_transaction_id to the validated data after it is available
            validated_data["external_transaction_id"] = external_transaction_id

            # Get the token using the PeoplesPayService
            token = PeoplesPayService.get_token()
            print(token)
            if token is None:
                return Response(
                    {"message": "Failed to retrieve token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Generate callback URL for PeoplesPay
            # callback_url = request.build_absolute_uri(reverse("payment-callback"))

            # Process the collection
            collection_payload = {
                "amount": str(validated_data["amount"]),
                "account_number": validated_data["account_number"],
                "account_name": validated_data["account_name"],
                "account_issuer": validated_data["account_issuer"],
                "callbackUrl": validated_data["callbackUrl"],
                "description": validated_data["description"],
                "externalTransactionId": str(external_transaction_id),
            }
            collection_headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token['data']}",
            }

            try:
                print("trying to send collection")
                print(collection_payload)
                collection_response = requests.post(
                    f"{PeoplesPayService.BASE_URL}/collectmoney",
                    json=collection_payload,
                    headers=collection_headers,
                )
                collection_data = collection_response.json()
                print(collection_data)

                if collection_response.status_code == 200 and collection_data.get(
                    "success"
                ):
                    # Save collection record, including external_transaction_id
                    collection_serializer.save(
                        external_transaction_id=external_transaction_id
                    )

                    # Create a corresponding payment entry with the same external_transaction_id
                    Payments.objects.create(
                        external_transaction_id=external_transaction_id,
                        amount=validated_data["amount"],
                        account_name=validated_data["account_name"],
                        account_number=validated_data["account_number"],
                        account_issuer=validated_data["account_issuer"],
                    )
                    print(Payments.objects)
                    return Response(
                        {
                            "message": "Collection processed successfully",
                            "external_transaction_id": str(external_transaction_id),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {
                            "message": collection_data.get(
                                "message", "Collection failed"
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except requests.exceptions.RequestException as e:
                return Response(
                    {"message": f"Error processing collection: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            collection_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class PaymentCallbackAPIView(APIView):
    def post(self, request):
        transaction_id = request.data.get("externalTransactionId")
        payment_success = request.data.get(
            "success", False
        )  # Defaults to False if missing

        # Validate incoming data
        if not transaction_id or payment_success is None:
            return Response(
                {"error": "Missing required fields: externalTransactionId or success"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the collection related to this transaction using external_transaction_id
        try:
            collection = Collections.objects.get(external_transaction_id=transaction_id)
            print(collection, f"collection data")
            if payment_success:
                collection.transaction_status = "completed"
            else:
                collection.transaction_status = "failed"
            collection.save()

            return Response(
                {
                    "message": "Callback processed successfully",
                    "transaction_id": collection.external_transaction_id,
                    "amount": collection.amount,
                    "status": collection.transaction_status,
                    "account_name": collection.account_name,
                    "description": collection.description,
                    "created_at": collection.created_at,
                },
                status=status.HTTP_200_OK,
            )
        except Collections.DoesNotExist:
            return Response(
                {"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND
            )


class NameEnquiryView(APIView):
    def post(self, request):
        serializer = NameEnquirySerializer(data=request.data)
        token = PeoplesPayService.get_token()
        if serializer.is_valid():
            data = serializer.validated_data
            enquiry_payload = {
                "account_type": data["account_type"],
                "account_number": data["account_number"],
                "account_issuer": data["account_issuer"],
            }
            print(enquiry_payload, f"enquiry payload")
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token['data']}",
            }
            print(headers, f"headers")
            try:
                response = requests.post(
                    f"{PeoplesPayService.BASE_URL}/enquiry",
                    json=enquiry_payload,
                    headers=headers,
                )
                response_data = response.json()
                print(response_data, f"response data")
                if response.status_code == 200 and response_data.get("success"):
                    return Response(
                        {
                            "message": "Enquiry processed successfully",
                            "data": response_data["data"],
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "error": response_data.get("message", "Enquiry failed"),
                            "code": response_data.get("code"),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except requests.exceptions.RequestException as e:
                return Response(
                    {"error": f"Error processing enquiry: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
