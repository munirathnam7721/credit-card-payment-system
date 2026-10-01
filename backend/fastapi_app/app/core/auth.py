import os
import sys

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

import jwt


# ---------------------------------------------------------
# Locate Django project
# ---------------------------------------------------------

DJANGO_PROJECT_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "..",
        "django_app",
    )
)

if DJANGO_PROJECT_PATH not in sys.path:
    sys.path.insert(0, DJANGO_PROJECT_PATH)


# ---------------------------------------------------------
# Import Django SECRET_KEY directly
# ---------------------------------------------------------

from config.settings import SECRET_KEY as DJANGO_SECRET_KEY


# ---------------------------------------------------------
# JWT Authentication
# ---------------------------------------------------------

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            DJANGO_SECRET_KEY,
            algorithms=["HS256"],
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user_id missing.",
            )

        return int(user_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )