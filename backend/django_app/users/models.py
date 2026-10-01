from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            name=name,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            email=email,
            name=name,
            password=password,
            **extra_fields
        )


class User(AbstractBaseUser):
    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    is_admin = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    is_superuser = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email