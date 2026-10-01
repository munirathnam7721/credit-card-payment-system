from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from django.contrib.auth.hashers import check_password

from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from config.settings import SECRET_KEY as DJANGO_SECRET_KEY


router = APIRouter()


@router.post(
    "/login",
    response_model=LoginResponse,
    tags=["Authentication"],
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.execute(
        text("""
            SELECT id, email, password, is_active
            FROM users_user
            WHERE email = :email
        """),
        {
            "email": login_data.email.lower().strip(),
        },
    ).mappings().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    if not check_password(
        login_data.password,
        user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    now = datetime.now(timezone.utc)

    expire = now + timedelta(minutes=30)

    payload = {
        "user_id": user["id"],
        "token_type": "access",
        "iat": now,
        "exp": expire,
    }

    access_token = jwt.encode(
        payload,
        DJANGO_SECRET_KEY,
        algorithm="HS256",
    )

    return LoginResponse(
        access=access_token,
        token_type="Bearer",
    )