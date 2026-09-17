from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.models import User, FinancialProfile, CreditHistory, Transaction, SavingsGoal, FamilyMember, AuditLog, SecuritySession
from app.routers import (
    auth_router, profile_router, ai_router, credit_router,
    calculator_router, expenses_router, ocr_router, savings_router,
    fraud_router, investment_router, family_router, whatsapp_router,
    security_router
)

Base.metadata.create_all(bind=engine)

def seed_demo_user():
    db = SessionLocal()
    try:
        demo = db.query(User).filter(User.email == "demo@creditassistant.ai").first()
        if not demo:
            demo = User(
                email="demo@creditassistant.ai",
                hashed_password=get_password_hash("password123"),
                full_name="Rajesh Sharma",
                phone_number="+91 98765 43210",
                is_active=True,
                is_verified=True,
                role="admin",
                mfa_enabled=True
            )
            db.add(demo)
            db.commit()
            db.refresh(demo)
            
            profile = FinancialProfile(
                user_id=demo.id,
                age=29,
                occupation="Senior Product Engineer",
                monthly_income=95000.0,
                monthly_expenses=34000.0,
                existing_emi=16500.0,
                total_debt=280000.0,
                credit_score=758,
                credit_limit=250000.0,
                used_credit=54000.0,
                emergency_fund=210000.0,
                savings_goal=600000.0,
                dti_ratio=34.8,
                credit_utilization=21.6,
                disposable_income=44500.0,
                financial_health_index=84.2
            )
            db.add(profile)
            
            now = datetime.utcnow()
            for idx, sc in enumerate([715, 725, 735, 742, 750, 758]):
                ch = CreditHistory(
                    user_id=demo.id,
                    score=sc,
                    payment_history_score=98.5,
                    utilization_rate=max(18.0, 32.0 - (idx * 2.0)),
                    dti=36.0 - (idx * 0.3),
                    recorded_at=now - timedelta(days=30 * (5 - idx)),
                    notes="CIBIL monthly bureau data"
                )
                db.add(ch)
                
            db.commit()
    finally:
        db.close()

# Seed immediately so tests and server always have demo user ready
seed_demo_user()

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_demo_user()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AI FinTech Platform for Credit Health, Prediction, Loan Affordability and Explainable Advisory",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(credit_router, prefix=settings.API_V1_STR)
app.include_router(calculator_router, prefix=settings.API_V1_STR)
app.include_router(expenses_router, prefix=settings.API_V1_STR)
app.include_router(ocr_router, prefix=settings.API_V1_STR)
app.include_router(savings_router, prefix=settings.API_V1_STR)
app.include_router(fraud_router, prefix=settings.API_V1_STR)
app.include_router(investment_router, prefix=settings.API_V1_STR)
app.include_router(family_router, prefix=settings.API_V1_STR)
app.include_router(whatsapp_router, prefix=settings.API_V1_STR)
app.include_router(security_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "documentation": "/docs"
    }
