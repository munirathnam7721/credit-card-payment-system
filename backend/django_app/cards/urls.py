from django.urls import path

from .views import (
    CardCreateView,
    CardDeleteView,
    CardListView,
)


urlpatterns = [
    path(
        "",
        CardListView.as_view(),
        name="card-list",
    ),

    path(
        "add/",
        CardCreateView.as_view(),
        name="card-create",
    ),

    path(
        "<int:pk>/",
        CardDeleteView.as_view(),
        name="card-delete",
    ),
]