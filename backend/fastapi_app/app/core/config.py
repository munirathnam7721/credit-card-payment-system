import os

from dotenv import load_dotenv


load_dotenv()


class Settings:

    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE = os.getenv(
        "MYSQL_DATABASE",
        "credit_card_db",
    )
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")

    SECRET_KEY = os.getenv("SECRET_KEY", "")

    DATABASE_URL = (
        f"mysql+pymysql://"
        f"{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}"
        f"/{MYSQL_DATABASE}"
    )


settings = Settings()