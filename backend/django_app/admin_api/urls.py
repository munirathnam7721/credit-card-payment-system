from django.urls import path

from .views import (
    TransactionCSVExportView,
    DailyPaymentSummaryView,
    AdminUserListView,
    AdminCardListView,
    AdminTransactionListView,
)

urlpatterns = [
    path(
        "transactions/export/",
        TransactionCSVExportView.as_view(),
        name="transaction-csv-export",
    ),

    path(
        "summary/daily/",
        DailyPaymentSummaryView.as_view(),
        name="daily-payment-summary",
    ),

    path(
        "users/",
        AdminUserListView.as_view(),
        name="admin-user-list",
    ),

    path(
        "cards/",
        AdminCardListView.as_view(),
        name="admin-card-list",
    ),

    path(
        "transactions/",
        AdminTransactionListView.as_view(),
        name="admin-transaction-list",
    ),
]