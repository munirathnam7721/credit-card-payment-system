from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.payments import router as payment_router
from app.api.auth import router as auth_router


app = FastAPI(
    title="Credit Card Payment API",
    description="Payment processing service for the Credit Card Payment System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/auth",
)

app.include_router(
    payment_router,
    prefix="/api/payments",
    tags=["Payments"],
)


@app.get("/")
def root():
    return {
        "message": "Credit Card Payment API is running"
    }