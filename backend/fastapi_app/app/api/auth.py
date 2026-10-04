from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.config import settings
from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse


router = APIRouter()


# ---------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------

pwd_context = CryptContext(
    schemes=["django_pbkdf2_sha256"],
    deprecated="auto",
)


# ---------------------------------------------------------
# Verify Django Password
# ---------------------------------------------------------

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain password against a Django PBKDF2 hash.
    """
    try:
        return pwd_context.verify(
            plain_password,
            hashed_password,
        )
    except Exception:
        return False


# ---------------------------------------------------------
# Login
# ---------------------------------------------------------

@router.post(
    "/login",
    response_model=LoginResponse,
    tags=["Authentication"],
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    # Find user from the shared MySQL database
    user = db.execute(
        text(
            """
            SELECT id, email, password, is_active
            FROM users_user
            WHERE email = :email
            LIMIT 1
            """
        ),
        {
            "email": login_data.email.lower().strip(),
        },
    ).mappings().first()

    # User does not exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # User account is inactive
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    # Verify password
    if not verify_password(
        login_data.password,
        user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # -----------------------------------------------------
    # Create JWT access token
    # -----------------------------------------------------

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
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return LoginResponse(
        access=access_token,
        token_type="Bearer",
    )